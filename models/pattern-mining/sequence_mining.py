def frequent_sequences(events: list[str], window: int = 3) -> dict[tuple[str, ...], int]:
    counts: dict[tuple[str, ...], int] = {}
    for index in range(max(len(events) - window + 1, 0)):
        key = tuple(events[index : index + window])
        counts[key] = counts.get(key, 0) + 1
    return counts

