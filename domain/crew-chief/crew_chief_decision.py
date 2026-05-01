from dataclasses import dataclass, field
from enum import Enum


class DecisionStatus(str, Enum):
    PROPOSED = "proposed"
    APPROVED = "approved"
    REJECTED = "rejected"
    DEFERRED = "deferred"


@dataclass(frozen=True)
class CrewChiefDecision:
    decision_id: str
    recommendation_id: str
    status: DecisionStatus
    approver: str
    risk_score: float
    evidence: list[str] = field(default_factory=list)

    @property
    def is_actionable(self) -> bool:
        return self.status == DecisionStatus.APPROVED and self.risk_score < 0.7

