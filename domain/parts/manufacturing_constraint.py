from dataclasses import dataclass


@dataclass(frozen=True)
class ManufacturingConstraint:
    method: str
    max_weight_g: float
    min_wall_thickness_mm: float
    regulatory_notes: str = ""

