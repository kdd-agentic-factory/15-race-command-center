def compare_metric_by_setup(samples: list[dict[str, object]], metric: str, setup_key: str) -> dict[str, float]:
    grouped: dict[str, list[float]] = {}
    for sample in samples:
        key = str(sample.get(setup_key, "unknown"))
        grouped.setdefault(key, []).append(float(sample.get(metric, 0.0)))
    return {key: sum(values) / len(values) for key, values in grouped.items() if values}

