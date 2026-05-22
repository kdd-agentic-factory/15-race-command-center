from fastapi import APIRouter
from race_command_center.models.simulation import SimulationRequest, SimulationResult
from race_command_center.utils.ids import new_simulation_id

router = APIRouter()

_results: dict[str, SimulationResult] = {}


@router.post("/what-if")
async def run_what_if(payload: SimulationRequest):
    sim_id = new_simulation_id()
    change_keys = list(payload.setup_change.keys())
    change_str = ", ".join(f"{k}={v}" for k, v in payload.setup_change.items())

    result = SimulationResult(
        simulation_id=sim_id,
        status="completed",
        baseline_setup_id=payload.baseline_setup_id,
        change_summary=change_str or "no change specified",
        risk_level="medium",
        estimated_lap_delta_ms=-180 if "engine_map" in change_keys else -50,
        corner_impacts=[
            {"corner_id": "T1", "delta_ms": -20, "spin_risk": "medium"},
            {"corner_id": "T5", "delta_ms": -15, "spin_risk": "low"},
            {"corner_id": "T13", "delta_ms": -40, "spin_risk": "medium"},
        ],
        thermal_risk="medium",
        spin_risk="medium" if "engine_map" in change_keys else "low",
        stability_risk="low",
        notes=payload.notes,
        mode="mock",
    )
    _results[sim_id] = result
    return result


@router.get("/{simulation_id}")
async def get_simulation(simulation_id: str):
    result = _results.get(simulation_id)
    if not result:
        return {"simulation_id": simulation_id, "status": "not_found", "mode": "mock"}
    return result


@router.get("")
async def list_simulations():
    return {"simulations": list(_results.values()), "total": len(_results)}
