from dataclasses import dataclass

try:
    from .recommendation import Recommendation
except ImportError:
    from recommendation import Recommendation


@dataclass(frozen=True)
class ApprovalGate:
    max_risk_score: float = 0.7
    require_human: bool = True

    def can_auto_apply(self, recommendation: Recommendation, risk_score: float) -> bool:
        if self.require_human or recommendation.approval_required:
            return False
        return risk_score <= self.max_risk_score and recommendation.confidence >= 0.8

