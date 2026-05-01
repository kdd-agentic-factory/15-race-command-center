def collapse_risk_markers(samples: list[dict[str, float]]) -> list[str]:
    markers: list[str] = []
    if not samples:
        return markers
    avg_spin = sum(sample.get("spin_ratio", 0.0) for sample in samples) / len(samples)
    avg_tps = sum(sample.get("tps", 0.0) for sample in samples) / len(samples)
    avg_carcass = sum(sample.get("tire_temp_carcass", 0.0) for sample in samples) / len(samples)
    if avg_spin > 0.08:
        markers.append("spin_ratio_increased")
    if avg_tps > 75.0:
        markers.append("same_lap_time_requires_more_tps")
    if avg_carcass > 105.0:
        markers.append("carcass_temperature_above_expected_window")
    return markers

