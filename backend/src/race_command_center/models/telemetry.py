from pydantic import BaseModel, Field


class TelemetrySample(BaseModel):
    ts: float
    session_id: str | None = None
    lap_id: str | None = None
    phase: str | None = None

    speed: float | None = None
    rpm: float | None = None
    gear: int | None = None
    tps: float | None = None

    brake_press_front: float | None = None
    brake_press_rear: float | None = None

    imu_roll: float | None = None
    imu_pitch: float | None = None
    imu_yaw: float | None = None

    susp_travel_f: float | None = None
    susp_travel_r: float | None = None

    tire_temp_surface: float | None = None
    tire_temp_carcass: float | None = None
    wheel_speed_f: float | None = None
    wheel_speed_r: float | None = None
    spin_ratio: float | None = None

    oil_pressure: float | None = None
    engine_temp: float | None = None

    physics_loss: float | None = None
    imu_drift: float | None = None


class TelemetryWindow(BaseModel):
    session_id: str
    lap_id: str | None = None
    corner_id: str | None = None
    samples: list[TelemetrySample] = Field(default_factory=list)
    feature_summary: dict = Field(default_factory=dict)
