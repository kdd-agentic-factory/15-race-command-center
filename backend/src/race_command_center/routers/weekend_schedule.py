"""Weekend Schedule dynamic contingency planner (Spec §9)."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from race_command_center.services import weekend_schedule as ws

router = APIRouter()


class ScheduleTask(BaseModel):
    name: str
    category: str = ""
    priority: int = Field(..., ge=1, le=5, description="1=critical … 5=optional")
    minutes: int = Field(..., ge=0)
    tags: list[str] = Field(default_factory=list)


class ReplanRequest(BaseModel):
    tasks: list[ScheduleTask] = Field(..., min_length=1)
    event: str = Field(..., description="rain|dirty_track|oil_spill|low_grip|heat|session_delay")
    remaining_minutes: int = Field(..., gt=0)
    severity: float = Field(1.0, ge=0.0, le=1.0)


@router.post("/replan")
async def replan(payload: ReplanRequest) -> dict:
    try:
        return ws.replan_weekend(
            [t.model_dump() for t in payload.tasks],
            payload.event,
            payload.remaining_minutes,
            severity=payload.severity,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/events")
async def events() -> dict:
    """List the contingency events the planner understands."""
    return {"events": [{"event": k, "rationale": v["note"]} for k, v in ws._RULES.items()]}
