def bucket_by_corner(samples: list[dict[str, object]]) -> dict[str, list[dict[str, object]]]:
    buckets: dict[str, list[dict[str, object]]] = {}
    for sample in samples:
        corner_id = str(sample.get("corner_id", "unknown"))
        buckets.setdefault(corner_id, []).append(sample)
    return buckets

