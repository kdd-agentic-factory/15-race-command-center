from __future__ import annotations

import logging

import httpx
from fastapi import APIRouter, HTTPException

from race_command_center.config import settings
from race_command_center.database import (
    list_simulation_results,
    load_simulation_result,
    save_simulation_result,
)
from race_command_center.models.simulation import SimulationRequest, SimulationResult
from race_command_center.utils.ids import new_simulation_id

logger = logging.getLogger(__name__)
router = APIRouter()

_TIMEOUT = httpx.Timeout(30.0, connect=5.0)


def _dt_client() -> httpx.AsyncClient:
    return httpx.AsyncClient(base_url=settings.digital_twin_url, timeout=_TIMEOUT)


def _map_result(sim_id: str, baseline_setup_id: str, payload: dict) -> SimulationResult:
    """Map digital-twin what-if response into our SimulationResult schema."""
    summary = payload.get("summary", {})
    risk = payload.get("risk_classification", {})
    lap_delta_s = summary.get("lap_time_delta_s", 0.0)

    return SimulationResult(
        simulation_id=sim_id,
        status="completed",
        baseline_setup_id=baseline_setup_id,
        change_summary=payload.get("recommendation", ""),
        risk_level=risk.get("level", "medium"),
        estimated_lap_delta_ms=round(lap_delta_s * 1000, 1) if lap_delta_s is not None else None,
        corner_impacts=[],
        thermal_risk="high" if abs(summary.get("rear_carcass_temp_delta_c", 0)) > 8 else "medium" if abs(summary.get("rear_carcass_temp_delta_c", 0)) > 4 else "low",
        spin_risk="high" if abs(summary.get("spin_t05_delta_pct", 0)) > 8 else "medium" if abs(summary.get("spin_t05_delta_pct", 0)) > 4 else "low",
        stability_risk=risk.get("category", "low"),
        notes=str(payload.get("evidence", [])),
        mode="digital_twin",
    )


@router.post("/what-if")
async def run_what_if(payload: SimulationRequest) -> SimulationResult:
    """Delegate what-if simulation to the Digital Twin service and persist the result."""
    sim_id = new_simulation_id()
    scenario_id = payload.scenario_id or f"rcc-{payload.baseline_setup_id}"

    dt_payload = {
        "scenario_id": scenario_id,
        "circuit_id": payload.circuit_id or "unknown",
        "session_id": payload.session_id or sim_id,
        "baseline_setup_id": payload.baseline_setup_id,
        "proposed_setup": payload.setup_change,
        "laps": payload.laps,
        "ambient_temp_c": payload.ambient_temp_c,
        "track_temp_c": payload.track_temp_c,
        "tire_compound": payload.tire_compound,
    }

    try:
        async with _dt_client() as client:
            resp = await client.post("/what-if", json=dt_payload)
            resp.raise_for_status()
            dt_result = resp.json()
    except httpx.HTTPStatusError as exc:
        logger.error("Digital-twin what-if HTTP error: %s", exc)
        raise HTTPException(status_code=502, detail=f"Digital twin error: {exc.response.status_code}")
    except Exception as exc:
        logger.warning("Digital-twin unavailable, returning degraded result: %s", exc)
        dt_result = {}

    result = _map_result(sim_id, payload.baseline_setup_id, dt_result)
    result_dict = result.model_dump(mode="json")
    result_dict["_raw_dt"] = dt_result

    await save_simulation_result(
        simulation_id=sim_id,
        baseline_setup_id=payload.baseline_setup_id,
        result=result_dict,
        session_id=payload.session_id,
        circuit_id=payload.circuit_id,
    )
    return result


@router.get("/{simulation_id}")
async def get_simulation(simulation_id: str) -> dict:
    data = await load_simulation_result(simulation_id)
    if not data:
        raise HTTPException(status_code=404, detail=f"Simulation {simulation_id!r} not found")
    return data


@router.get("")
async def list_simulations(session_id: str | None = None) -> dict:
    results = await list_simulation_results(session_id=session_id)
    return {"simulations": results, "total": len(results)}
