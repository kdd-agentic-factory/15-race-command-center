import json
import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from race_command_center.database import get_session
from race_command_center.models.decision import CrewChiefDecision, DecisionApprove, DecisionReject
from race_command_center.utils.ids import new_decision_id
from race_command_center.utils.time import utcnow_iso

router = APIRouter()
logger = logging.getLogger(__name__)


def _row_to_decision(row) -> CrewChiefDecision:
    d = dict(row._mapping)
    d["evidence"] = json.loads(d.get("evidence") or "[]")
    return CrewChiefDecision(**d)


@router.get("")
async def list_decisions(db: AsyncSession = Depends(get_session)):
    result = await db.execute(text("SELECT * FROM decisions ORDER BY created_at DESC"))
    rows = result.fetchall()
    decisions = [_row_to_decision(r) for r in rows]
    return {"decisions": decisions, "total": len(decisions)}


@router.get("/{decision_id}")
async def get_decision(decision_id: str, db: AsyncSession = Depends(get_session)):
    result = await db.execute(
        text("SELECT * FROM decisions WHERE decision_id = :id"),
        {"id": decision_id},
    )
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail=f"Decision {decision_id!r} not found")
    return _row_to_decision(row)


@router.post("", status_code=201)
async def create_decision(payload: CrewChiefDecision, db: AsyncSession = Depends(get_session)):
    if not payload.decision_id:
        payload.decision_id = new_decision_id()
    if not payload.created_at:
        payload.created_at = utcnow_iso()

    await db.execute(
        text("""
            INSERT INTO decisions
                (decision_id, session_id, recommendation_id, title, decision_type,
                 risk_level, status, proposed_by, approved_by, evidence,
                 simulation_id, workflow_id, created_at, decided_at, notes)
            VALUES
                (:decision_id, :session_id, :recommendation_id, :title, :decision_type,
                 :risk_level, :status, :proposed_by, :approved_by, :evidence,
                 :simulation_id, :workflow_id, :created_at, :decided_at, :notes)
            ON CONFLICT(decision_id) DO UPDATE SET
                status = excluded.status,
                notes  = excluded.notes
        """),
        {
            **payload.model_dump(),
            "evidence": json.dumps(payload.evidence),
        },
    )
    await db.commit()
    logger.info("Decision created: %s (%s)", payload.decision_id, payload.decision_type)
    return payload


@router.post("/{decision_id}/approve")
async def approve_decision(
    decision_id: str,
    payload: DecisionApprove,
    db: AsyncSession = Depends(get_session),
):
    result = await db.execute(
        text("""
            UPDATE decisions
            SET status = 'approved', approved_by = :approved_by,
                decided_at = :decided_at, notes = :notes
            WHERE decision_id = :id
        """),
        {
            "id": decision_id,
            "approved_by": payload.approved_by,
            "decided_at": utcnow_iso(),
            "notes": payload.notes,
        },
    )
    await db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail=f"Decision {decision_id!r} not found")
    logger.info("Decision approved: %s by %s", decision_id, payload.approved_by)
    return {"decision_id": decision_id, "status": "approved", "approved_by": payload.approved_by}


@router.post("/{decision_id}/reject")
async def reject_decision(
    decision_id: str,
    payload: DecisionReject,
    db: AsyncSession = Depends(get_session),
):
    result = await db.execute(
        text("""
            UPDATE decisions
            SET status = 'rejected', decided_at = :decided_at, notes = :notes
            WHERE decision_id = :id
        """),
        {"id": decision_id, "decided_at": utcnow_iso(), "notes": payload.reason},
    )
    await db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail=f"Decision {decision_id!r} not found")
    logger.info("Decision rejected: %s — %s", decision_id, payload.reason)
    return {"decision_id": decision_id, "status": "rejected", "reason": payload.reason}


@router.post("/{decision_id}/request-simulation")
async def request_simulation(decision_id: str, db: AsyncSession = Depends(get_session)):
    result = await db.execute(
        text("UPDATE decisions SET status = 'simulation_required' WHERE decision_id = :id"),
        {"id": decision_id},
    )
    await db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail=f"Decision {decision_id!r} not found")
    return {"decision_id": decision_id, "status": "simulation_required"}
