from pydantic import BaseModel, Field


class RaceRecommendation(BaseModel):
    recommendation_id: str
    session_id: str | None = None
    title: str
    recommendation_type: str

    description: str
    rationale: str
    confidence: float
    risk_level: str

    requires_simulation: bool = True
    requires_approval: bool = True

    evidence: list[dict] = Field(default_factory=list)
    suggested_actions: list[str] = Field(default_factory=list)
    status: str = "draft"
