from fastapi import APIRouter
from race_command_center.models.session import RaceSession, SessionCreate
from race_command_center.utils.ids import new_session_id
from race_command_center.utils.time import utcnow_iso

router = APIRouter()

_sessions: dict[str, RaceSession] = {}


@router.get("")
async def list_sessions():
    return {"sessions": list(_sessions.values()), "total": len(_sessions)}


@router.post("", status_code=201)
async def create_session(payload: SessionCreate):
    session_id = new_session_id()
    session = RaceSession(
        session_id=session_id,
        circuit_id=payload.circuit_id,
        bike_id=payload.bike_id,
        rider_id=payload.rider_id,
        session_type=payload.session_type,
        weekend_id=payload.weekend_id,
        weather=payload.weather,
        status="active",
        started_at=utcnow_iso(),
    )
    _sessions[session_id] = session
    return session


@router.get("/{session_id}")
async def get_session(session_id: str):
    session = _sessions.get(session_id)
    if not session:
        return {"session_id": session_id, "status": "not_found", "mode": "mock"}
    return session


@router.post("/{session_id}/close")
async def close_session(session_id: str):
    session = _sessions.get(session_id)
    if session:
        session.status = "closed"
        session.ended_at = utcnow_iso()
    return {"session_id": session_id, "status": "closed"}
