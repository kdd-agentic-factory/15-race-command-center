from dataclasses import dataclass, field


@dataclass(frozen=True)
class DiscoveredPattern:
    pattern_id: str
    description: str
    confidence: float
    evidence: dict[str, list[str] | list[int]]
    suggested_action: list[str] = field(default_factory=list)
    requires_crew_chief_approval: bool = True

