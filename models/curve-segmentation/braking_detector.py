def is_braking(sample: dict[str, float], previous: dict[str, float] | None = None) -> bool:
    tps_low = sample.get("tps", 100.0) < 15.0
    brake_high = sample.get("brake_press_front", 0.0) > 3.0
    if previous is None:
        return tps_low and brake_high
    decel = sample.get("gps_speed", sample.get("wheel_speed_f", 0.0)) < previous.get("gps_speed", previous.get("wheel_speed_f", 0.0))
    return tps_low and brake_high and decel

