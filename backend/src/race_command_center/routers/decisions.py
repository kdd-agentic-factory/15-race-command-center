import json
import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from race_command_center.auth_deps import Principal, get_current_principal
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
async def create_decision(
    payload: CrewChiefDecision,
    db: AsyncSession = Depends(get_session),
    principal: Principal = Depends(get_current_principal),
):
    if not payload.decision_id:
        payload.decision_id = new_decision_id()
    if not payload.created_at:
        payload.created_at = utcnow_iso()

    # Use the authenticated principal — never trust client-supplied proposed_by
    effective_proposed_by = principal.display_name or principal.id
    effective_approved_by = None

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
            **payload.model_dump(exclude={"proposed_by", "approved_by"}),
            "proposed_by": effective_proposed_by,
            "approved_by": effective_approved_by,
            "evidence": json.dumps(payload.evidence),
        },
    )
    await db.commit()
    logger.info(
        "Decision created: %s (%s) by %s",
        payload.decision_id,
        payload.decision_type,
        effective_proposed_by,
    )
    return payload


@router.post("/{decision_id}/approve")
async def approve_decision(
    decision_id: str,
    payload: DecisionApprove,
    db: AsyncSession = Depends(get_session),
    principal: Principal = Depends(get_current_principal),
):
    # Use the authenticated principal — NEVER trust client-supplied approved_by
    effective_approver = principal.display_name or principal.id

    result = await db.execute(
        text("""
            UPDATE decisions
            SET status = 'approved', approved_by = :approved_by,
                decided_at = :decided_at, notes = :notes
            WHERE decision_id = :id
        """),
        {
            "id": decision_id,
            "approved_by": effective_approver,
            "decided_at": utcnow_iso(),
            "notes": payload.notes,
        },
    )
    await db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail=f"Decision {decision_id!r} not found")
    logger.info("Decision approved: %s by %s", decision_id, effective_approver)
    return {"decision_id": decision_id, "status": "approved", "approved_by": effective_approver}


@router.post("/{decision_id}/reject")
async def reject_decision(
    decision_id: str,
    payload: DecisionReject,
    db: AsyncSession = Depends(get_session),
    principal: Principal = Depends(get_current_principal),
):
    effective_rejector = principal.display_name or principal.id

    result = await db.execute(
        text("""
            UPDATE decisions
            SET status = 'rejected', decided_at = :decided_at, notes = :notes
            WHERE decision_id = :id
        """),
        {"id": decision_id, "decided_at": utcnow_iso(), "notes": f"Rejected by {effective_rejector}: {payload.reason}"},
    )
    await db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail=f"Decision {decision_id!r} not found")
    logger.info("Decision rejected: %s by %s — %s", decision_id, effective_rejector, payload.reason)
    return {"decision_id": decision_id, "status": "rejected", "rejected_by": effective_rejector, "reason": payload.reason}


@router.post("/{decision_id}/request-simulation")
async def request_simulation(
    decision_id: str,
    db: AsyncSession = Depends(get_session),
    principal: Principal = Depends(get_current_principal),
):
    result = await db.execute(
        text("UPDATE decisions SET status = 'simulation_required' WHERE decision_id = :id"),
        {"id": decision_id},
    )
    await db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail=f"Decision {decision_id!r} not found")
    logger.info(
        "Simulation requested for decision %s by %s",
        decision_id, principal.display_name or principal.id,
    )
    return {"decision_id": decision_id, "status": "simulation_required"}
