from dataclasses import dataclass


@dataclass(frozen=True)
class CircuitRequirement:
    circuit_id: str
    downforce_priority: float
    cooling_priority: float
    drag_sensitivity: float
    abrasive_index: float

