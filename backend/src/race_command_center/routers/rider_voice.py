"""Rider voice-debrief channel (Spec §12).

Accepts the rider's transcribed post-session impressions, interprets them and
returns staff-segmented recommendations, storing each debrief in an in-session
knowledge repository.
"""

from __future__ import annotations

import logging
from collections import deque
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, Field

from race_command_center.database import get_session
from race_command_center.services import rider_debrief
from race_command_center.services.governance_reporting import (
    count_feedback_entries,
    list_feedback_entries,
    persist_feedback_entry,
)

router = APIRouter()
logger = logging.getLogger(__name__)

# Bounded in-memory repository (tribal-knowledge log for the weekend).
_DEBRIEFS: deque[dict[str, Any]] = deque(maxlen=500)


class DebriefRequest(BaseModel):
    transcript: str = Field(..., min_length=1, description="Speech-to-text of the rider impressions")
    rider: str | None = None
    session_id: str | None = None


@router.post("/debrief")
async def post_debrief(payload: DebriefRequest, db: AsyncSession = Depends(get_session)) -> dict:
    if not payload.transcript.strip():
        raise HTTPException(status_code=400, detail="Empty transcript")
    result = rider_debrief.debrief(payload.transcript)
    record = {
        "id": f"debrief-{len(_DEBRIEFS) + 1}-{int(datetime.now(timezone.utc).timestamp())}",
        "rider": payload.rider,
        "session_id": payload.session_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
        **result,
    }
    _DEBRIEFS.append(record)
    await persist_feedback_entry(record, db=db)
    await db.commit()
    logger.info("Rider debrief stored: %s", result["summary"])
    return record


@router.get("/debriefs")
async def list_debriefs(limit: int = 50, db: AsyncSession = Depends(get_session)) -> dict:
    items = await list_feedback_entries(db=db, limit=limit)
    return {"debriefs": items, "count": len(items), "total": await count_feedback_entries(db=db)}
