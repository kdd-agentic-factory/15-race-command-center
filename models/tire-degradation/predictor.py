from dataclasses import dataclass, field


@dataclass(frozen=True)
class TireDegradationPrediction:
    rear_tire_status: str
    estimated_collapse_lap: int | None
    confidence: float
    evidence: list[str] = field(default_factory=list)
    recommendation: list[str] = field(default_factory=list)


def spin_ratio(wheel_speed_r: float, gps_speed: float) -> float:
    if gps_speed <= 1e-6:
        return 0.0
    return (wheel_speed_r - gps_speed) / gps_speed


def thermal_stress(surface_temp_c: float, carcass_temp_c: float) -> float:
    return carcass_temp_c + max(surface_temp_c - carcass_temp_c, 0.0) * 0.5


def predict_rear_tire(samples: list[dict[str, float]], current_lap: int) -> TireDegradationPrediction:
    if not samples:
        return TireDegradationPrediction("unknown", None, 0.0)

    ratios = [spin_ratio(s.get("wheel_speed_r", 0.0), s.get("gps_speed", s.get("wheel_speed_f", 0.0))) for s in samples]
    stress = [thermal_stress(s.get("tire_temp_surface", 0.0), s.get("tire_temp_carcass", 0.0)) for s in samples]
    avg_spin = sum(ratios) / len(ratios)
    avg_stress = sum(stress) / len(stress)

    evidence: list[str] = []
    if avg_spin > 0.08:
        evidence.append("spin_ratio_above_expected_window")
    if avg_stress > 115.0:
        evidence.append("carcass_temperature_above_expected_window")

    if len(evidence) >= 2:
        return TireDegradationPrediction(
            rear_tire_status="warning",
            estimated_collapse_lap=current_lap + 4,
            confidence=0.82,
            evidence=evidence,
            recommendation=["switch_to_engine_map_2", "reduce_torque_delivery_in_high_spin_corners"],
        )

    return TireDegradationPrediction("ok", None, 0.68, evidence)

