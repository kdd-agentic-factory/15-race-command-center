from pydantic import BaseModel, Field


class CrewChiefDecision(BaseModel):
    decision_id: str
    session_id: str | None = None
    recommendation_id: str | None = None

    title: str
    decision_type: str
    risk_level: str

    status: str = "proposed"
    proposed_by: str = "system"
    approved_by: str | None = None

    evidence: list[dict] = Field(default_factory=list)
    simulation_id: str | None = None
    workflow_id: str | None = None

    created_at: str | None = None
    decided_at: str | None = None
    notes: str | None = None


class DecisionApprove(BaseModel):
    approved_by: str = "crew_chief"
    notes: str | None = None


class DecisionReject(BaseModel):
    reason: str
    rejected_by: str = "crew_chief"
