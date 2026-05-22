from pydantic import BaseModel, Field


class CircuitSpecificPart(BaseModel):
    part_id: str
    name: str
    part_type: str
    target_circuit_id: str

    problem_statement: str
    technical_hypothesis: str
    expected_impact: str

    material: str | None = None
    estimated_weight_g: float | None = None
    manufacturing_method: str | None = None

    risk_level: str = "medium"
    status: str = "concept"

    simulation_id: str | None = None
    evidence: list[dict] = Field(default_factory=list)
    approval_status: str = "pending"
    metadata: dict = Field(default_factory=dict)


class PartCreate(BaseModel):
    name: str
    part_type: str
    target_circuit_id: str
    problem_statement: str
    technical_hypothesis: str
    expected_impact: str
    material: str | None = None
    estimated_weight_g: float | None = None
    manufacturing_method: str | None = None
    risk_level: str = "medium"
