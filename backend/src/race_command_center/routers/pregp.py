"""Pre-GP workspace router — serves circuit preparation data for race weekends."""
import logging

from fastapi import APIRouter

logger = logging.getLogger(__name__)
router = APIRouter()

_MOCK_PRE_GP: dict[str, dict] = {
    "jerez": {
        "circuit_id": "jerez",
        "circuit_name": "Circuito de Jerez",
        "braking_demand": "high",
        "traction_demand": "medium",
        "surface_abrasion": "high",
        "weather_forecast": {
            "condition": "sunny",
            "temp_track_c": 42,
            "temp_air_c": 28,
            "humidity_pct": 35,
            "wind_kmh": 12,
        },
        "baseline_setup_id": "setup-base-jerez",
        "part_candidates": ["part-brake-jerez", "part-tire-duct"],
        "fp1_run_plan": [
            {"run": 1, "objective": "Baseline validation", "laps": 8, "compound": "medium/soft"},
            {"run": 2, "objective": "Rear grip comparison", "laps": 6, "compound": "soft/soft"},
            {"run": 3, "objective": "Engine Map 2 what-if check", "laps": 5, "compound": "soft/soft"},
        ],
        "risk_assessment": {
            "tire_degradation": "high",
            "brake_thermal": "medium",
            "spin_risk": "medium",
            "stability": "low",
        },
        "crew_chief_notes": (
            "Focus on rear tire management in drive phases. "
            "Evaluate brake duct V1 from FP1 run 2."
        ),
    },
    "mugello": {
        "circuit_id": "mugello",
        "circuit_name": "Autodromo del Mugello",
        "braking_demand": "medium",
        "traction_demand": "high",
        "surface_abrasion": "medium",
        "weather_forecast": {
            "condition": "partly_cloudy",
            "temp_track_c": 38,
            "temp_air_c": 25,
            "humidity_pct": 45,
            "wind_kmh": 8,
        },
        "baseline_setup_id": "setup-base-mugello",
        "part_candidates": ["part-rear-wing-low", "part-engine-map-3"],
        "fp1_run_plan": [
            {"run": 1, "objective": "Aero balance check", "laps": 7, "compound": "medium/medium"},
            {"run": 2, "objective": "Top speed vs downforce trade-off", "laps": 6, "compound": "hard/medium"},
            {"run": 3, "objective": "Long-run tire wear assessment", "laps": 8, "compound": "medium/soft"},
        ],
        "risk_assessment": {
            "tire_degradation": "medium",
            "brake_thermal": "low",
            "spin_risk": "high",
            "stability": "medium",
        },
        "crew_chief_notes": (
            "High-speed sections stress rear tire carcass. "
            "Monitor spin ratio at Arrabbiata and Bucine exits."
        ),
    },
    "assen": {
        "circuit_id": "assen",
        "circuit_name": "TT Circuit Assen",
        "braking_demand": "medium",
        "traction_demand": "medium",
        "surface_abrasion": "low",
        "weather_forecast": {
            "condition": "overcast",
            "temp_track_c": 26,
            "temp_air_c": 19,
            "humidity_pct": 72,
            "wind_kmh": 22,
        },
        "baseline_setup_id": "setup-base-assen",
        "part_candidates": ["part-chassis-flex-medium", "part-brake-pad-soft"],
        "fp1_run_plan": [
            {"run": 1, "objective": "Wet/damp setup baseline", "laps": 6, "compound": "medium/medium"},
            {"run": 2, "objective": "Wind sensitivity check", "laps": 5, "compound": "soft/medium"},
            {"run": 3, "objective": "Chassis balance on medium-speed sweepers", "laps": 7, "compound": "soft/soft"},
        ],
        "risk_assessment": {
            "tire_degradation": "low",
            "brake_thermal": "medium",
            "spin_risk": "low",
            "stability": "high",
        },
        "crew_chief_notes": (
            "Low abrasion surface — tire warm-up is the main challenge. "
            "Wind direction changes can affect chassis balance significantly."
        ),
    },
}


@router.get("/workspace/{circuit_id}")
async def get_pregp_workspace(circuit_id: str):
    workspace = _MOCK_PRE_GP.get(circuit_id)
    if not workspace:
        return {
            "circuit_id": circuit_id,
            "status": "not_found",
            "message": (
                "No pre-GP workspace found. Create one to start preparation. "
                f"Available circuits: {sorted(_MOCK_PRE_GP)}"
            ),
        }
    return workspace


@router.post("/workspace/{circuit_id}/generate-report")
async def generate_pregp_report(circuit_id: str, payload: dict):
    return {
        "report_id": f"pregp-{circuit_id}-rpt",
        "circuit_id": circuit_id,
        "status": "generated",
        "sections": ["circuit_profile", "weather", "setup", "parts", "fp1_plan", "risk"],
    }
