from dataclasses import dataclass, field

try:
    from .setup_change import SetupChange
except ImportError:
    from setup_change import SetupChange


@dataclass(frozen=True)
class Recommendation:
    recommendation_id: str
    title: str
    changes: list[SetupChange]
    confidence: float
    expected_effect: str
    evidence: list[str] = field(default_factory=list)
    approval_required: bool = True

