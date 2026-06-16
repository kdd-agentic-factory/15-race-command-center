from __future__ import annotations

import json
from collections import deque
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from race_command_center.models.durable import FeedbackEntry, GovernanceAction, ReportSnapshot
from race_command_center.models.report import Report
from race_command_center.utils.ids import new_id
from race_command_center.utils.time import utcnow_iso

_REPORT_CACHE: deque[dict[str, Any]] = deque(maxlen=500)
_GOVERNANCE_CACHE: deque[dict[str, Any]] = deque(maxlen=1000)
_FEEDBACK_CACHE: deque[dict[str, Any]] = deque(maxlen=1000)


def reset_history() -> None:
    _REPORT_CACHE.clear()
    _GOVERNANCE_CACHE.clear()
    _FEEDBACK_CACHE.clear()


def _dump(payload: Any) -> str:
    return json.dumps(payload, sort_keys=True, separators=(",", ":"))


def _report_record(report: Report) -> dict:
    return report.model_dump()


def _report_from_record(record: dict[str, Any]) -> Report:
    return Report(**record)


async def persist_report_snapshot(report: Report, db: AsyncSession | None = None) -> Report:
    record = _report_record(report)
    if db is None:
        _REPORT_CACHE.append(record)
        return report

    db.add(
        ReportSnapshot(
            snapshot_id=new_id("rpt-snap"),
            report_id=report.report_id,
            report_type=report.report_type,
            session_id=report.session_id,
            circuit_id=report.circuit_id,
            report_json=_dump(record),
            created_at=report.created_at or utcnow_iso(),
        )
    )
    await db.flush()
    return report


async def get_report_snapshot(report_id: str, db: AsyncSession | None = None) -> Report | None:
    if db is None:
        for record in reversed(_REPORT_CACHE):
            if record.get("report_id") == report_id:
                return _report_from_record(record)
        return None

    result = await db.execute(
        select(ReportSnapshot).where(ReportSnapshot.report_id == report_id).limit(1)
    )
    snapshot = result.scalar_one_or_none()
    return _report_from_record(snapshot.to_record()) if snapshot else None


async def list_report_snapshots(db: AsyncSession | None = None, limit: int = 50) -> list[Report]:
    if db is None:
        return [_report_from_record(record) for record in list(_REPORT_CACHE)[-limit:][::-1]]

    result = await db.execute(
        select(ReportSnapshot).order_by(ReportSnapshot.created_at.desc()).limit(limit)
    )
    return [_report_from_record(snapshot.to_record()) for snapshot in result.scalars().all()]


async def count_report_snapshots(db: AsyncSession | None = None) -> int:
    if db is None:
        return len(_REPORT_CACHE)

    result = await db.execute(select(ReportSnapshot))
    return len(result.scalars().all())


async def persist_governance_action(
    *,
    decision_id: str,
    action_type: str,
    actor: str | None,
    notes: str | None = None,
    payload: dict[str, Any] | None = None,
    db: AsyncSession | None = None,
) -> dict[str, Any]:
    record = {
        "action_id": new_id("gov-act"),
        "decision_id": decision_id,
        "action_type": action_type,
        "actor": actor,
        "notes": notes,
        "payload": payload or {},
        "created_at": utcnow_iso(),
    }
    if db is None:
        _GOVERNANCE_CACHE.append(record)
        return record

    db.add(
        GovernanceAction(
            action_id=record["action_id"],
            decision_id=decision_id,
            action_type=action_type,
            actor=actor,
            notes=notes,
            payload_json=_dump(record["payload"]),
            created_at=record["created_at"],
        )
    )
    await db.flush()
    return record


async def list_governance_actions(
    decision_id: str | None = None,
    db: AsyncSession | None = None,
    limit: int = 50,
) -> list[dict[str, Any]]:
    if db is None:
        items = list(_GOVERNANCE_CACHE)
        if decision_id is not None:
            items = [item for item in items if item.get("decision_id") == decision_id]
        return items[-limit:][::-1]

    statement = select(GovernanceAction).order_by(GovernanceAction.created_at.desc()).limit(limit)
    if decision_id is not None:
        statement = statement.where(GovernanceAction.decision_id == decision_id)
    result = await db.execute(statement)
    return [action.to_record() for action in result.scalars().all()]


async def count_governance_actions(
    decision_id: str | None = None,
    db: AsyncSession | None = None,
) -> int:
    if db is None:
        items = list(_GOVERNANCE_CACHE)
        if decision_id is not None:
            items = [item for item in items if item.get("decision_id") == decision_id]
        return len(items)

    statement = select(GovernanceAction)
    if decision_id is not None:
        statement = statement.where(GovernanceAction.decision_id == decision_id)
    result = await db.execute(statement)
    return len(result.scalars().all())


async def persist_feedback_entry(record: dict[str, Any], db: AsyncSession | None = None) -> dict[str, Any]:
    feedback_record = {
        **record,
        "id": record.get("id") or new_id("fbk"),
        "created_at": record.get("created_at") or utcnow_iso(),
    }
    if db is None:
        _FEEDBACK_CACHE.append(feedback_record)
        return feedback_record

    db.add(
        FeedbackEntry(
            feedback_id=feedback_record["id"],
            session_id=feedback_record.get("session_id"),
            source=feedback_record.get("rider") or feedback_record.get("source") or "rider_voice",
            feedback_kind=feedback_record.get("feedback_kind", "rider_debrief"),
            payload_json=_dump(feedback_record),
            created_at=feedback_record["created_at"],
        )
    )
    await db.flush()
    return feedback_record


async def list_feedback_entries(
    db: AsyncSession | None = None,
    session_id: str | None = None,
    limit: int = 50,
) -> list[dict[str, Any]]:
    if db is None:
        items = list(_FEEDBACK_CACHE)
        if session_id is not None:
            items = [item for item in items if item.get("session_id") == session_id]
        return items[-limit:][::-1]

    statement = select(FeedbackEntry).order_by(FeedbackEntry.created_at.desc()).limit(limit)
    if session_id is not None:
        statement = statement.where(FeedbackEntry.session_id == session_id)
    result = await db.execute(statement)
    return [entry.to_record() for entry in result.scalars().all()]


async def count_feedback_entries(
    db: AsyncSession | None = None,
    session_id: str | None = None,
) -> int:
    if db is None:
        items = list(_FEEDBACK_CACHE)
        if session_id is not None:
            items = [item for item in items if item.get("session_id") == session_id]
        return len(items)

    statement = select(FeedbackEntry)
    if session_id is not None:
        statement = statement.where(FeedbackEntry.session_id == session_id)
    result = await db.execute(statement)
    return len(result.scalars().all())
