try:
    from .apex_detector import apex_index
    from .braking_detector import is_braking
    from .corner_phase import CornerPhase, CornerPhaseName
    from .drive_detector import is_drive
except ImportError:
    from apex_detector import apex_index
    from braking_detector import is_braking
    from corner_phase import CornerPhase, CornerPhaseName
    from drive_detector import is_drive


def segment_corner(samples: list[dict[str, float]]) -> dict[str, CornerPhase | None]:
    if not samples:
        return {"braking": None, "apex": None, "drive": None}

    apex_pos = apex_index(samples)
    braking_samples = [sample for index, sample in enumerate(samples[: apex_pos + 1]) if is_braking(sample, samples[index - 1] if index else None)]
    drive_samples = [sample for index, sample in enumerate(samples[apex_pos:], start=apex_pos) if is_drive(sample, samples[index - 1] if index else None)]
    apex_sample = samples[apex_pos]

    return {
        "braking": _phase(CornerPhaseName.BRAKING, braking_samples, "max_brake_pressure_bar", "brake_press_front"),
        "apex": CornerPhase(
            name=CornerPhaseName.APEX,
            start_ts=int(apex_sample["ts_micro"]),
            end_ts=int(apex_sample["ts_micro"]),
            metrics={
                "min_speed_kmh": apex_sample.get("gps_speed", apex_sample.get("wheel_speed_f", 0.0)),
                "max_lean_angle_deg": abs(apex_sample.get("lean_angle", apex_sample.get("imu_roll", 0.0))),
            },
        ),
        "drive": _phase(CornerPhaseName.DRIVE, drive_samples, "max_spin_ratio", "spin_ratio"),
    }


def _phase(name: CornerPhaseName, samples: list[dict[str, float]], metric_name: str, source: str) -> CornerPhase | None:
    if not samples:
        return None
    return CornerPhase(
        name=name,
        start_ts=int(samples[0]["ts_micro"]),
        end_ts=int(samples[-1]["ts_micro"]),
        metrics={metric_name: max(sample.get(source, 0.0) for sample in samples)},
    )

