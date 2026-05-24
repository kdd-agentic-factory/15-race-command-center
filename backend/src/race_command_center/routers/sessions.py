import json
import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from race_command_center.database import get_session
from race_command_center.models.session import RaceSession, SessionCreate
from race_command_center.utils.ids import new_session_id
from race_command_center.utils.time import utcnow_iso

router = APIRouter()
logger = logging.getLogger(__name__)


def _row_to_session(row) -> RaceSession:
    d = dict(row._mapping)
    d["weather"] = json.loads(d.get("weather") or "{}")
    d["metadata"] = json.loads(d.get("metadata") or "{}")
    return RaceSession(**d)


@router.get("")
async def list_sessions(db: AsyncSession = Depends(get_session)):
    result = await db.execute(text("SELECT * FROM race_sessions ORDER BY started_at DESC"))
    rows = result.fetchall()
    sessions = [_row_to_session(r) for r in rows]
    return {"sessions": sessions, "total": len(sessions)}


@router.post("", status_code=201)
async def create_session(payload: SessionCreate, db: AsyncSession = Depends(get_session)):
    session_id = new_session_id()
    now = utcnow_iso()
    session = RaceSession(
        session_id=session_id,
        circuit_id=payload.circuit_id,
        bike_id=payload.bike_id,
        rider_id=payload.rider_id,
        session_type=payload.session_type,
        weekend_id=payload.weekend_id,
        weather=payload.weather,
        status="active",
        started_at=now,
    )
    await db.execute(
        text("""
            INSERT INTO race_sessions
                (session_id, weekend_id, circuit_id, bike_id, rider_id,
                 session_type, status, started_at, weather, metadata)
            VALUES
                (:session_id, :weekend_id, :circuit_id, :bike_id, :rider_id,
                 :session_type, :status, :started_at, :weather, :metadata)
        """),
        {
            **session.model_dump(),
            "weather": json.dumps(session.weather),
            "metadata": json.dumps(session.metadata),
        },
    )
    await db.commit()
    logger.info("Session created: %s at %s (%s)", session_id, payload.circuit_id, payload.session_type)
    return session


@router.get("/{session_id}")
async def get_session_by_id(session_id: str, db: AsyncSession = Depends(get_session)):
    result = await db.execute(
        text("SELECT * FROM race_sessions WHERE session_id = :id"),
        {"id": session_id},
    )
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail=f"Session {session_id!r} not found")
    return _row_to_session(row)


@router.post("/{session_id}/close")
async def close_session(session_id: str, db: AsyncSession = Depends(get_session)):
    result = await db.execute(
        text("""
            UPDATE race_sessions
            SET status = 'closed', ended_at = :ended_at
            WHERE session_id = :id
        """),
        {"id": session_id, "ended_at": utcnow_iso()},
    )
    await db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail=f"Session {session_id!r} not found")
    logger.info("Session closed: %s", session_id)
    return {"session_id": session_id, "status": "closed"}
