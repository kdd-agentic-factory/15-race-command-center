def is_drive(sample: dict[str, float], previous: dict[str, float] | None = None) -> bool:
    brake_released = sample.get("brake_press_front", 0.0) < 2.0
    throttle_opening = sample.get("tps", 0.0) > 20.0
    if previous is None:
        return brake_released and throttle_opening
    throttle_rising = sample.get("tps", 0.0) >= previous.get("tps", 0.0)
    wheel_delta = sample.get("wheel_speed_r", 0.0) - sample.get("wheel_speed_f", 0.0)
    return brake_released and throttle_opening and throttle_rising and wheel_delta >= -2.0

