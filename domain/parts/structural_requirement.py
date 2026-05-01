from dataclasses import dataclass


@dataclass(frozen=True)
class StructuralRequirement:
    load_case: str
    safety_factor: float
    allow_gyroid_lattice: bool = False

