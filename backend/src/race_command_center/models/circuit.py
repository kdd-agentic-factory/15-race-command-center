from pydantic import BaseModel, Field


class CornerProfile(BaseModel):
    corner_id: str
    name: str
    corner_type: str
    entry_speed: float | None = None
    min_speed: float | None = None
    max_lean_angle: float | None = None
    max_brake_pressure: float | None = None
    avg_spin_ratio: float | None = None
    drive_efficiency: float | None = None
    time_lost: float | None = None
    risk_level: str = "low"
    recommendations: list[str] = Field(default_factory=list)


class CircuitProfile(BaseModel):
    circuit_id: str
    name: str
    country: str
    length_km: float | None = None
    num_corners: int | None = None
    braking_demand: str | None = None
    traction_demand: str | None = None
    surface_abrasion: str | None = None
    corners: list[CornerProfile] = Field(default_factory=list)
    metadata: dict = Field(default_factory=dict)
