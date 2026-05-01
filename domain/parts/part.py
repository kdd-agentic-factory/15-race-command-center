from dataclasses import dataclass, field


@dataclass(frozen=True)
class PartDesign:
    part_id: str
    circuit: str
    objective: list[str]
    constraints: dict[str, str | float | int]
    target_metrics: dict[str, float]
    approval_required: bool = True
    evidence: list[str] = field(default_factory=list)

