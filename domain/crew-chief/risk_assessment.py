from dataclasses import dataclass


@dataclass(frozen=True)
class RiskAssessment:
    thermal_risk: float
    stability_risk: float
    regulatory_risk: float
    confidence: float

    @property
    def score(self) -> float:
        raw = (self.thermal_risk * 0.35) + (self.stability_risk * 0.45) + (self.regulatory_risk * 0.2)
        return round(raw * (1.0 + (1.0 - self.confidence) * 0.25), 3)

