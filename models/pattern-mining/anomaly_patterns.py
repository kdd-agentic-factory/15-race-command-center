def z_score_anomalies(values: list[float], threshold: float = 2.5) -> list[int]:
    if not values:
        return []
    mean = sum(values) / len(values)
    variance = sum((value - mean) ** 2 for value in values) / len(values)
    std = variance ** 0.5
    if std <= 1e-9:
        return []
    return [index for index, value in enumerate(values) if abs((value - mean) / std) >= threshold]

