from pydantic import BaseModel, Field


class SimulationRequest(BaseModel):
    baseline_setup_id: str
    setup_change: dict = Field(default_factory=dict)
    circuit_id: str | None = None
    session_id: str | None = None
    scenario_id: str | None = None
    laps: int = Field(default=5, ge=1)
    ambient_temp_c: float = 28.0
    track_temp_c: float = 40.0
    tire_compound: str = "medium"
    part_id: str | None = None
    notes: str | None = None


class SimulationResult(BaseModel):
    simulation_id: str
    status: str = "completed"
    baseline_setup_id: str
    change_summary: str = ""
    risk_level: str = "medium"
    estimated_lap_delta_ms: float | None = None
    corner_impacts: list[dict] = Field(default_factory=list)
    thermal_risk: str | None = None
    spin_risk: str | None = None
    stability_risk: str | None = None
    notes: str | None = None
    mode: str = "mock"
