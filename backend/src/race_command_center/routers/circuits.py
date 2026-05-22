from fastapi import APIRouter
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
    ),
}


@router.get("")
async def list_circuits():
    return {"circuits": list(_CIRCUITS.values()), "total": len(_CIRCUITS)}


@router.get("/{circuit_id}")
async def get_circuit(circuit_id: str):
    circuit = _CIRCUITS.get(circuit_id)
    if not circuit:
        return {"circuit_id": circuit_id, "status": "not_found", "mode": "mock"}
    return circuit


@router.get("/{circuit_id}/corners")
async def get_corners(circuit_id: str):
    circuit = _CIRCUITS.get(circuit_id)
    if not circuit:
        return {"corners": [], "mode": "mock"}
    return {"circuit_id": circuit_id, "corners": circuit.corners}
