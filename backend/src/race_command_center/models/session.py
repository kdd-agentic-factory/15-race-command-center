from pydantic import BaseModel, Field


class RaceSession(BaseModel):
    session_id: str
    weekend_id: str | None = None
    circuit_id: str
    bike_id: str
    rider_id: str | None = None
    session_type: str
    status: str = "created"
    started_at: str | None = None
    ended_at: str | None = None
    weather: dict = Field(default_factory=dict)
    metadata: dict = Field(default_factory=dict)


class SessionCreate(BaseModel):
    circuit_id: str
    bike_id: str
    rider_id: str | None = None
    session_type: str
    weekend_id: str | None = None
    weather: dict = Field(default_factory=dict)
