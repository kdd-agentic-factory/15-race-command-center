from fastapi import APIRouter

router = APIRouter()

_MOCK_PRE_GP = {
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
        "crew_chief_notes": "Focus on rear tire management in drive phases. Evaluate brake duct V1 from FP1 run 2.",
        "mode": "mock",
    }
}


@router.get("/workspace/{circuit_id}")
async def get_pregp_workspace(circuit_id: str):
    workspace = _MOCK_PRE_GP.get(circuit_id)
    if not workspace:
        return {
            "circuit_id": circuit_id,
            "status": "not_found",
            "mode": "mock",
            "message": "No pre-GP workspace found. Create one to start preparation.",
        }
    return workspace


@router.post("/workspace/{circuit_id}/generate-report")
async def generate_pregp_report(circuit_id: str, payload: dict):
    return {
        "report_id": f"pregp-{circuit_id}-rpt",
        "circuit_id": circuit_id,
        "status": "generated",
        "sections": ["circuit_profile", "weather", "setup", "parts", "fp1_plan", "risk"],
        "mode": "mock",
    }
