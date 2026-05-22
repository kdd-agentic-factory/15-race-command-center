from pydantic import BaseModel, Field


class BikeSetup(BaseModel):
    setup_id: str
    session_id: str | None = None
    name: str

    front_preload: float | None = None
    rear_preload: float | None = None
    front_compression: float | None = None
    rear_compression: float | None = None
    front_rebound: float | None = None
    rear_rebound: float | None = None

    front_ride_height: float | None = None
    rear_ride_height: float | None = None
    wheelbase: float | None = None
    swingarm_length: float | None = None

    engine_map: str | None = None
    traction_control_map: str | None = None
    anti_wheelie_map: str | None = None
    engine_brake_map: str | None = None

    front_tire_pressure: float | None = None
    rear_tire_pressure: float | None = None
    front_compound: str | None = None
    rear_compound: str | None = None

    aero_package: str | None = None
    custom_parts: list[str] = Field(default_factory=list)
    status: str = "draft"


class SetupDiff(BaseModel):
    baseline_setup_id: str
    proposed_setup_id: str
    changes: list[dict] = Field(default_factory=list)
    risk_level: str = "low"
    summary: str = ""
