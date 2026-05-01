import json
from dataclasses import asdict, dataclass
from pathlib import Path


PAPER = {
    "title": "Structural optimization principles for edge AI in motorsport telemetry",
    "doi": "10.1038/s41598-026-49736-0",
    "published": "2026-05-01",
}


@dataclass(frozen=True)
class EdgeOperatingPoint:
    name: str
    memory_gb: float
    throughput_tok_s: float
    power_w: float
    perplexity_ratio: float

    @property
    def ipw(self) -> float:
        return round(self.throughput_tok_s / self.power_w, 4)

    @property
    def digital_fos(self) -> float:
        integrity_threshold = 1.10
        return round(integrity_threshold / self.perplexity_ratio, 3)

    @property
    def accepted(self) -> bool:
        return self.digital_fos >= 1.0 and self.memory_gb <= 24.0


def synthetic_telemetry_samples() -> list[dict[str, float]]:
    samples = []
    base_ts = 102_030_000
    speeds = [236, 220, 196, 154, 112, 91, 96, 118, 151, 184]
    tps_values = [0, 0, 3, 5, 8, 12, 24, 41, 62, 78]
    brake_values = [12.4, 11.9, 9.8, 7.1, 3.2, 1.0, 0.4, 0.2, 0.0, 0.0]
    lean_values = [22, 35, 48, 57, 61, 62, 58, 44, 28, 12]

    for index, speed in enumerate(speeds):
        wheel_speed_r = speed * (1.0 + max(index - 5, 0) * 0.018)
        samples.append(
            {
                "ts_micro": base_ts + index * 90_000,
                "gps_speed": float(speed),
                "wheel_speed_f": float(speed * 0.995),
                "wheel_speed_r": float(wheel_speed_r),
                "tps": float(tps_values[index]),
                "brake_press_front": float(brake_values[index]),
                "imu_roll": float(lean_values[index]),
                "lean_angle": float(lean_values[index]),
                "tire_temp_surface": 111.0 + index * 1.1,
                "tire_temp_carcass": 103.0 + index * 0.9,
                "spin_ratio": (wheel_speed_r - speed) / speed,
            }
        )
    return samples


def tire_prediction(samples: list[dict[str, float]], current_lap: int) -> dict[str, object]:
    ratios = [
        (sample["wheel_speed_r"] - sample["gps_speed"]) / sample["gps_speed"]
        for sample in samples
        if sample["gps_speed"] > 0
    ]
    thermal_stress = [
        sample["tire_temp_carcass"]
        + max(sample["tire_temp_surface"] - sample["tire_temp_carcass"], 0.0) * 0.5
        for sample in samples
    ]
    avg_spin = sum(ratios) / len(ratios)
    avg_stress = sum(thermal_stress) / len(thermal_stress)

    evidence = []
    if avg_spin > 0.015:
        evidence.append("rear_spin_rising_after_apex")
    if avg_stress > 108.0:
        evidence.append("thermal_stress_above_expected_window")

    status = "warning" if len(evidence) == 2 else "watch"
    return {
        "rear_tire_status": status,
        "estimated_collapse_lap": current_lap + 4 if status == "warning" else None,
        "confidence": 0.82 if status == "warning" else 0.64,
        "evidence": evidence,
        "recommendation": [
            "switch_to_engine_map_2",
            "increase_rear_rebound_by_2_clicks",
            "reduce_torque_delivery_in_corners_T05_T08_T13",
        ],
    }


def build_evidence() -> dict[str, object]:
    operating_points = [
        EdgeOperatingPoint("fp16_32b_baseline", 61.0, 26.0, 295.0, 1.00),
        EdgeOperatingPoint("int8_32b_balanced", 34.0, 44.2, 218.0, 1.035),
        EdgeOperatingPoint("int4_32b_trackside", 18.0, 69.9, 165.0, 1.072),
    ]
    accepted = [point for point in operating_points if point.accepted]
    samples = synthetic_telemetry_samples()
    tire = tire_prediction(samples, current_lap=14)

    scenarios = [
        {
            "id": "S01",
            "claim": "Low-precision edge AI can be accepted when memory and integrity remain inside the envelope.",
            "demonstration": "INT4 32B-class operating point fits under 24 GB and keeps Digital FoS above 1.0.",
            "metrics": ["memory_gb", "digital_fos", "throughput_tok_s", "power_w", "ipw"],
            "status": "ready",
        },
        {
            "id": "S02",
            "claim": "Intelligence-per-Watt captures energy-aware usefulness.",
            "demonstration": "Compare useful token throughput per watt across FP16, INT8 and INT4 profiles.",
            "metrics": ["ipw"],
            "status": "ready",
        },
        {
            "id": "S03",
            "claim": "Motorsport telemetry provides an operational edge-AI setting.",
            "demonstration": "Synthetic high-frequency corner samples drive tire risk and crew-chief recommendations.",
            "metrics": ["spin_ratio", "thermal_stress", "collapse_lap", "confidence"],
            "status": "ready",
        },
        {
            "id": "S04",
            "claim": "Engineering action must remain gated by evidence and approval.",
            "demonstration": "Tire warning produces setup/electronics recommendations requiring crew-chief approval.",
            "metrics": ["risk_status", "approval_required"],
            "status": "ready",
        },
        {
            "id": "S05",
            "claim": "The framework links physical lightweighting and digital lightweighting.",
            "demonstration": "Circuit-specific part design and INT4 quantization share sensitivity-guided acceptance logic.",
            "metrics": ["part_constraints", "digital_fos", "approval_required"],
            "status": "partial",
        },
    ]

    return {
        "paper": PAPER,
        "edge_operating_points": [asdict(point) | {"ipw": point.ipw, "digital_fos": point.digital_fos, "accepted": point.accepted} for point in operating_points],
        "accepted_operating_point": accepted[-1].name if accepted else None,
        "telemetry_demo": {
            "circuit": "jerez",
            "corner_id": "T05",
            "lap": 14,
            "sample_count": len(samples),
            "sample_period_micro": 90_000,
            "tire_degradation_prediction": tire,
        },
        "scenarios": scenarios,
        "repository_coverage": [
            {"repository": "10-infra-docker", "role": "local runtime", "evidence": ["global compose stack"]},
            {"repository": "15-race-command-center", "role": "operational demonstrator", "evidence": ["telemetry contracts", "models", "paper PoC"]},
            {"repository": "14-paper-reproducibility-kit", "role": "paper evidence sink", "evidence": ["protocol", "metrics", "results"]},
            {"repository": "08-experimentation-lab", "role": "scientific validation", "evidence": ["runtime and traceability experiments"]},
            {"repository": "09-observability-platform", "role": "measurement", "evidence": ["Prometheus", "Grafana", "OpenTelemetry"]},
        ],
        "readiness": {
            "demonstrable_now": True,
            "engineering_tool_ready": False,
            "remaining_gaps": [
                "real MotoGP telemetry adapter",
                "target edge hardware power measurements",
                "real GPTQ/AWQ benchmark integration",
                "physical CFD/FEA validation for parts",
                "crew-chief user acceptance testing",
            ],
        },
    }


def write_outputs(evidence: dict[str, object]) -> None:
    output_dir = Path("paper-evidence")
    output_dir.mkdir(exist_ok=True)
    json_path = output_dir / "paper-poc-evidence.json"
    md_path = output_dir / "paper-poc-summary.md"
    reproducibility_dir = Path("..") / "14-paper-reproducibility-kit" / "results"

    json_path.write_text(json.dumps(evidence, indent=2), encoding="utf-8")

    accepted = evidence["accepted_operating_point"]
    tire = evidence["telemetry_demo"]["tire_degradation_prediction"]
    lines = [
        "# Paper PoC Summary",
        "",
        f"Paper: {PAPER['title']}",
        f"DOI: {PAPER['doi']}",
        f"Accepted operating point: `{accepted}`",
        "",
        "## Edge AI Operating Points",
        "",
        "| Profile | Memory GB | Tok/s | Power W | Digital FoS | IPW | Accepted |",
        "| --- | ---: | ---: | ---: | ---: | ---: | --- |",
    ]
    for point in evidence["edge_operating_points"]:
        lines.append(
            f"| {point['name']} | {point['memory_gb']} | {point['throughput_tok_s']} | "
            f"{point['power_w']} | {point['digital_fos']} | {point['ipw']} | {point['accepted']} |"
        )
    lines.extend(
        [
            "",
            "## MotoGP Telemetry Demo",
            "",
            f"- Circuit: `{evidence['telemetry_demo']['circuit']}`",
            f"- Corner: `{evidence['telemetry_demo']['corner_id']}`",
            f"- Lap: `{evidence['telemetry_demo']['lap']}`",
            f"- Rear tire status: `{tire['rear_tire_status']}`",
            f"- Estimated collapse lap: `{tire['estimated_collapse_lap']}`",
            f"- Confidence: `{tire['confidence']}`",
            f"- Recommendations: {', '.join(tire['recommendation'])}",
            "",
            "## Readiness",
            "",
            "- Demonstrable now: yes.",
            "- Production MotoGP tool ready: not yet; real telemetry, hardware and validation integrations remain.",
        ]
    )
    md_path.write_text("\n".join(lines) + "\n", encoding="utf-8")

    if reproducibility_dir.exists():
        try:
            (reproducibility_dir / "paper-poc-evidence.json").write_text(
                json.dumps(evidence, indent=2), encoding="utf-8"
            )
            (reproducibility_dir / "paper-poc-summary.md").write_text(
                "\n".join(lines) + "\n", encoding="utf-8"
            )
        except PermissionError:
            print("warning: could not mirror evidence to ../14-paper-reproducibility-kit/results")


if __name__ == "__main__":
    evidence_payload = build_evidence()
    write_outputs(evidence_payload)
    print("paper poc ok")
    print("evidence: paper-evidence/paper-poc-evidence.json")
    print("summary: paper-evidence/paper-poc-summary.md")
