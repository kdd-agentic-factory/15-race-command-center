import asyncio
import math
import time
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from race_command_center.websocket.manager import ConnectionManager

router = APIRouter()
manager = ConnectionManager()


def _make_sample(tick: int) -> dict:
    phase_tick = tick % 110
    braking = phase_tick < 36
    apex = 36 <= phase_tick < 52
    drive = phase_tick >= 52
    wave = math.sin(tick / 7)

    speed = (246 - phase_tick * 4.1) if braking else (96 + wave * 4) if apex else (98 + (phase_tick - 52) * 2.7)
    tps = (max(0, 7 - phase_tick * 0.15)) if braking else (12 + wave * 3) if apex else min(100, 18 + (phase_tick - 52) * 1.25)
    brake = (max(0, 12.5 - phase_tick * 0.24)) if braking else (1.2 if apex else 0.2)
    lean = (20 + phase_tick * 1.12) if braking else (62 + wave * 1.5) if apex else max(8, 62 - (phase_tick - 52) * 1.05)
    tire = 103 + min(tick / 28, 18) + max(phase_tick - 58, 0) * 0.035
    spin = max(0, (phase_tick - 52) * 0.00145 + math.sin(tick / 5) * 0.004) if drive else 0.004
    physics_loss = min(0.04, max(0.01, 0.014 + spin * 0.16 + abs(wave) * 0.004))
    imu_drift = min(0.7, max(0.22, 0.38 + math.sin(tick / 16) * 0.08 + spin * 1.5))

    return {
        "ts": time.time(),
        "phase": "braking" if braking else "apex" if apex else "drive",
        "speed": round(speed, 1),
        "tps": round(tps, 1),
        "brake_press_front": round(brake, 2),
        "imu_roll": round(lean, 1),
        "tire_temp_carcass": round(tire, 1),
        "spin_ratio": round(spin, 4),
        "physics_loss": round(physics_loss, 4),
        "imu_drift": round(imu_drift, 3),
        "rpm": round(12500 + math.sin(tick / 3) * 600),
    }


@router.websocket("/ws/telemetry")
async def telemetry_ws(websocket: WebSocket):
    await manager.connect(websocket)
    tick = 0
    try:
        while True:
            sample = _make_sample(tick)
            await websocket.send_json(sample)
            tick += 1
            await asyncio.sleep(0.1)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)


@router.get("/ws/connections")
async def ws_status():
    return {"active_connections": manager.connection_count}
