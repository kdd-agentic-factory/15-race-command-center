from __future__ import annotations

import random
import time
from typing import Annotated

from fastapi import APIRouter, Body, HTTPException, Query

from race_command_center.config import settings
from race_command_center.database import load_telemetry_by_session, save_telemetry_samples
from race_command_center.models.telemetry import TelemetrySample, TelemetryWindow

router = APIRouter()


# ---------------------------------------------------------------------------
# Dev / mock endpoints — only registered when ENABLE_MOCK_MODE is set (off in
# production), so synthetic-data routes are never exposed on a live deployment.
# ---------------------------------------------------------------------------

def _mock_sample(session_id: str | None = None) -> TelemetrySample:
    tick = time.time() % 110
    braking = tick < 36
    apex = 36 <= tick < 52
    drive = tick >= 52

    speed = (246 - tick * 4.1) if braking else (96 + random.random() * 4) if apex else (98 + (tick - 52) * 2.7)
    spin = (max(0, (tick - 52) * 0.00145 + random.random() * 0.004)) if drive else 0.004

    return TelemetrySample(
        ts=time.time(),
        session_id=session_id,
        phase="braking" if braking else "apex" if apex else "drive",
        speed=round(speed, 1),
        rpm=round(12500 + random.random() * 1200, 0),
        gear=random.randint(2, 6),
        tps=round(random.random() * 100, 1),
        brake_press_front=round(random.random() * 13, 2),
        imu_roll=round(random.uniform(-62, 62), 1),
        tire_temp_carcass=round(103 + min(tick / 28, 18) + max(tick - 58, 0) * 0.035, 1),
        spin_ratio=round(spin, 4),
        physics_loss=round(0.014 + spin * 0.16 + random.random() * 0.004, 4),
        imu_drift=round(0.38 + random.random() * 0.08 + spin * 1.5, 3),
    )


async def mock_telemetry(session_id: str | None = None) -> TelemetrySample:
    return _mock_sample(session_id)


async def mock_telemetry_batch(session_id: str | None = None, count: int = 10) -> dict:
    return {"samples": [_mock_sample(session_id) for _ in range(min(count, 100))]}


if settings.enable_mock_mode:
    router.add_api_route("/mock", mock_telemetry, methods=["GET"])
    router.add_api_route("/mock/batch", mock_telemetry_batch, methods=["GET"])


# ---------------------------------------------------------------------------
# Real telemetry endpoints — DB-backed
# ---------------------------------------------------------------------------

@router.post("/samples/{session_id}")
async def ingest_telemetry(
    session_id: str,
    samples: Annotated[list[dict], Body()],
) -> dict:
    """Ingest one or more telemetry samples for a session (from edge adapter or test harness)."""
    if not samples:
        raise HTTPException(status_code=400, detail="samples list must not be empty")
    saved = await save_telemetry_samples(session_id=session_id, samples=samples)
    return {"session_id": session_id, "saved": saved}


@router.post("/sample/{session_id}")
async def ingest_single(
    session_id: str,
    sample: TelemetrySample,
) -> dict:
    """Ingest a single typed TelemetrySample for a session."""
    data = sample.model_dump(exclude_none=True)
    data.setdefault("session_id", session_id)
    data.setdefault("ts", time.time())
    await save_telemetry_samples(session_id=session_id, samples=[data])
    return {"session_id": session_id, "saved": 1}


@router.get("/sessions/{session_id}")
async def get_telemetry(
    session_id: str,
    limit: int = Query(default=200, ge=1, le=2000),
) -> TelemetryWindow:
    """Return the most recent telemetry samples for a session from the DB."""
    raw = await load_telemetry_by_session(session_id=session_id, limit=limit)
    samples = [TelemetrySample.model_validate(s) for s in raw]
    return TelemetryWindow(session_id=session_id, samples=samples)
