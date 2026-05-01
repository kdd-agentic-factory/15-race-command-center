from dataclasses import dataclass


@dataclass(frozen=True)
class EKFState:
    x: list[float]
    covariance: list[list[float]]
    ts_micro: int

    @property
    def speed_kmh(self) -> float:
        if len(self.x) < 4:
            return 0.0
        vx, vy = self.x[2], self.x[3]
        return ((vx * vx + vy * vy) ** 0.5) * 3.6

