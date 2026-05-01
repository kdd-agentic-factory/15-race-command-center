from dataclasses import dataclass
from enum import Enum


class CornerPhaseName(str, Enum):
    BRAKING = "braking"
    APEX = "apex"
    DRIVE = "drive"


@dataclass(frozen=True)
class CornerPhase:
    name: CornerPhaseName
    start_ts: int
    end_ts: int
    metrics: dict[str, float]

