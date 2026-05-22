from fastapi import APIRouter
from race_command_center.models.decision import CrewChiefDecision, DecisionApprove, DecisionReject
from race_command_center.utils.ids import new_decision_id
from race_command_center.utils.time import utcnow_iso

router = APIRouter()

_decisions: dict[str, CrewChiefDecision] = {
    "dec-map2": CrewChiefDecision(
        decision_id="dec-map2",
        title="Switch to Engine Map 2 after lap 10",
        decision_type="engine_map",
        risk_level="medium",
        status="simulation_completed",
        proposed_by="copilot",
        evidence=[
            {"source": "telemetry", "type": "spin_ratio", "value": 0.083, "confidence": 0.91},
            {"source": "pattern", "type": "tire_degradation", "lap": 9, "confidence": 0.87},
        ],
        simulation_id="sim-map2-jerez",
        created_at=utcnow_iso(),
    ),
    "dec-rebound": CrewChiefDecision(
        decision_id="dec-rebound",
        title="Increase rear rebound by 2 clicks",
        decision_type="suspension",
        risk_level="high",
        status="crew_chief_review",
        proposed_by="copilot",
        evidence=[
            {"source": "telemetry", "type": "imu_drift", "value": 0.65, "confidence": 0.88},
        ],
        created_at=utcnow_iso(),
    ),
}


@router.get("")
async def list_decisions():
    return {"decisions": list(_decisions.values()), "total": len(_decisions)}


@router.get("/{decision_id}")
async def get_decision(decision_id: str):
    decision = _decisions.get(decision_id)
    if not decision:
        return {"decision_id": decision_id, "status": "not_found"}
    return decision


@router.post("", status_code=201)
async def create_decision(payload: CrewChiefDecision):
    _decisions[payload.decision_id] = payload
    return payload


@router.post("/{decision_id}/approve")
async def approve_decision(decision_id: str, payload: DecisionApprove):
    decision = _decisions.get(decision_id)
    if decision:
        decision.status = "approved"
        decision.approved_by = payload.approved_by
        decision.decided_at = utcnow_iso()
        decision.notes = payload.notes
    return {
        "decision_id": decision_id,
        "status": "approved",
        "approved_by": payload.approved_by,
    }


@router.post("/{decision_id}/reject")
async def reject_decision(decision_id: str, payload: DecisionReject):
    decision = _decisions.get(decision_id)
    if decision:
        decision.status = "rejected"
        decision.decided_at = utcnow_iso()
        decision.notes = payload.reason
    return {
        "decision_id": decision_id,
        "status": "rejected",
        "reason": payload.reason,
    }


@router.post("/{decision_id}/request-simulation")
async def request_simulation(decision_id: str):
    decision = _decisions.get(decision_id)
    if decision:
        decision.status = "simulation_required"
    return {"decision_id": decision_id, "status": "simulation_required"}
