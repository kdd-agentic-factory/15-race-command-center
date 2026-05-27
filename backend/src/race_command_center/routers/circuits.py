"""Circuits router — serves static circuit profiles from the in-memory catalogue."""
from fastapi import APIRouter, HTTPException
from race_command_center.models.circuit import CircuitProfile, CornerProfile

router = APIRouter()

_CIRCUITS: dict[str, CircuitProfile] = {
    "jerez": CircuitProfile(
        circuit_id="jerez",
        name="Circuito de Jerez",
        country="Spain",
        length_km=4.423,
        num_corners=13,
        braking_demand="high",
        traction_demand="medium",
        surface_abrasion="high",
        corners=[
            CornerProfile(
                corner_id="T1", name="Turn 1", corner_type="heavy_braking",
                entry_speed=250, min_speed=80, max_lean_angle=58, risk_level="high",
                recommendations=["Monitor front brake temperature", "Check spin on exit"],
            ),
            CornerProfile(
                corner_id="T5", name="Turn 5 (Sito Pons)", corner_type="technical",
                entry_speed=180, min_speed=72, max_lean_angle=62, risk_level="medium",
            ),
            CornerProfile(
                corner_id="T13", name="Turn 13 (Peluqui)", corner_type="long_sweep",
                entry_speed=160, min_speed=68, avg_spin_ratio=0.07, risk_level="high",
                recommendations=["Critical spin zone in drive phase"],
            ),
        ],
    ),
    "mugello": CircuitProfile(
        circuit_id="mugello",
        name="Autodromo del Mugello",
        country="Italy",
        length_km=5.245,
        num_corners=15,
        braking_demand="medium",
        traction_demand="high",
        surface_abrasion="medium",
        corners=[
            CornerProfile(
                corner_id="T1", name="San Donato", corner_type="heavy_braking",
                entry_speed=290, min_speed=70, max_lean_angle=55, risk_level="high",
                recommendations=["Heavy braking zone — monitor front temp"],
            ),
            CornerProfile(
                corner_id="T9", name="Arrabbiata 1", corner_type="fast_sweep",
                entry_speed=220, min_speed=145, max_lean_angle=63, risk_level="medium",
            ),
            CornerProfile(
                corner_id="T15", name="Bucine", corner_type="long_sweep",
                entry_speed=185, min_speed=95, avg_spin_ratio=0.065, risk_level="medium",
                recommendations=["Long traction zone — rear tire load"],
            ),
        ],
    ),
    "assen": CircuitProfile(
        circuit_id="assen",
        name="TT Circuit Assen",
        country="Netherlands",
        length_km=4.542,
        num_corners=18,
        braking_demand="medium",
        traction_demand="medium",
        surface_abrasion="low",
        corners=[
            CornerProfile(
                corner_id="T1", name="Gasunie", corner_type="slow_hairpin",
                entry_speed=200, min_speed=50, max_lean_angle=60, risk_level="medium",
            ),
            CornerProfile(
                corner_id="T9", name="Ramshoek", corner_type="fast_sweep",
                entry_speed=240, min_speed=170, max_lean_angle=65, risk_level="medium",
                recommendations=["Highest speed corner — chassis rigidity critical"],
            ),
            CornerProfile(
                corner_id="T18", name="Geert Timmer", corner_type="technical",
                entry_speed=155, min_speed=65, max_lean_angle=58, risk_level="low",
            ),
        ],
    ),
}


@router.get("")
async def list_circuits():
    return {"circuits": list(_CIRCUITS.values()), "total": len(_CIRCUITS)}


@router.get("/{circuit_id}")
async def get_circuit(circuit_id: str):
    circuit = _CIRCUITS.get(circuit_id)
    if not circuit:
        raise HTTPException(
            status_code=404,
            detail=f"Circuit '{circuit_id}' not found. Available: {sorted(_CIRCUITS)}",
        )
    return circuit


@router.get("/{circuit_id}/corners")
async def get_corners(circuit_id: str):
    circuit = _CIRCUITS.get(circuit_id)
    if not circuit:
        raise HTTPException(
            status_code=404,
            detail=f"Circuit '{circuit_id}' not found. Available: {sorted(_CIRCUITS)}",
        )
    return {"circuit_id": circuit_id, "corners": circuit.corners}
