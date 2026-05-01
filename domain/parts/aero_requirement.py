from dataclasses import dataclass


@dataclass(frozen=True)
class AeroRequirement:
    target_downforce_delta_percent: float
    drag_penalty_max_percent: float
    yaw_stability_priority: float

