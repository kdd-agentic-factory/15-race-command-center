def explain_pattern(pattern_id: str, markers: list[str]) -> str:
    if not markers:
        return f"{pattern_id}: no strong markers found."
    return f"{pattern_id}: driven by {', '.join(markers)}."

