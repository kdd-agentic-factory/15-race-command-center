RISK_ORDER = {"low": 0, "medium": 1, "high": 2, "critical": 3}


def classify_spin_risk(spin_ratio: float) -> str:
    if spin_ratio < 0.03:
        return "low"
    if spin_ratio < 0.06:
        return "medium"
    if spin_ratio < 0.09:
        return "high"
    return "critical"


def classify_tire_risk(tire_temp_c: float, baseline_c: float = 105.0) -> str:
    delta = tire_temp_c - baseline_c
    if delta < 5:
        return "low"
    if delta < 12:
        return "medium"
    if delta < 20:
        return "high"
    return "critical"


def highest_risk(*levels: str) -> str:
    valid = [l for l in levels if l in RISK_ORDER]
    if not valid:
        return "low"
    return max(valid, key=lambda l: RISK_ORDER[l])
