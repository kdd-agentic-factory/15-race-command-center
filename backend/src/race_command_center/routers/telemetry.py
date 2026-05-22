import random
import time
from fastapi import APIRouter
from race_command_center.models.telemetry import TelemetrySample

router = APIRouter()


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


@router.get("/mock")
async def mock_telemetry(session_id: str | None = None):
    return _mock_sample(session_id)


@router.get("/mock/batch")
async def mock_telemetry_batch(session_id: str | None = None, count: int = 10):
    return {"samples": [_mock_sample(session_id) for _ in range(min(count, 100))]}
