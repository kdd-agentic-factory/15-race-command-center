from dataclasses import dataclass


@dataclass(frozen=True)
class ThermalRequirement:
    target_temp_reduction_c: float
    max_operating_temp_c: float
    cooling_zone: str

