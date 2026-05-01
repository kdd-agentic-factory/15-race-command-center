def apex_index(samples: list[dict[str, float]]) -> int:
    if not samples:
        return -1
    return min(
        range(len(samples)),
        key=lambda index: (
            samples[index].get("gps_speed", samples[index].get("wheel_speed_f", 999.0)),
            -abs(samples[index].get("lean_angle", samples[index].get("imu_roll", 0.0))),
        ),
    )

