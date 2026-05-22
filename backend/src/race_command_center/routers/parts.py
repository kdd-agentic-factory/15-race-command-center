from fastapi import APIRouter
from race_command_center.models.part import CircuitSpecificPart, PartCreate
from race_command_center.utils.ids import new_part_id
from race_command_center.utils.time import utcnow_iso

router = APIRouter()

_parts: dict[str, CircuitSpecificPart] = {
    "part-brake-jerez": CircuitSpecificPart(
        part_id="part-brake-jerez",
        name="Brake Duct Jerez V1",
        part_type="cooling",
        target_circuit_id="jerez",
        problem_statement="Front brake overheating under repeated heavy braking at T1 and T5.",
        technical_hypothesis="Increased airflow through modified duct reduces brake temperature by 15°C.",
        expected_impact="Stable brake pressure and reduced fade risk in long braking zones.",
        material="PA12_CF",
        estimated_weight_g=142,
        manufacturing_method="SLS_3D_printing",
        risk_level="low",
        status="designed",
        approval_status="pending",
    ),
    "part-tire-duct": CircuitSpecificPart(
        part_id="part-tire-duct",
        name="Rear Tire Cooling Duct",
        part_type="thermal_management",
        target_circuit_id="jerez",
        problem_statement="Rear carcass temperature drift in long drive phases causes spin.",
        technical_hypothesis="Directed airflow reduces carcass temperature accumulation.",
        expected_impact="Reduce rear carcass temperature drift in long drive phases.",
        material="carbon_fiber_composite",
        estimated_weight_g=85,
        risk_level="medium",
        status="simulated",
        approval_status="pending",
    ),
    "part-deflector-mugello": CircuitSpecificPart(
        part_id="part-deflector-mugello",
        name="Low-Drag Side Deflector",
        part_type="aerodynamic",
        target_circuit_id="mugello",
        problem_statement="High-speed instability on Mugello straight causes rider confidence loss.",
        technical_hypothesis="Shaped deflector reduces drag while adding lateral stability.",
        expected_impact="Improve high-speed stability with minimal drag penalty.",
        risk_level="high",
        status="concept",
        approval_status="pending",
    ),
}


@router.get("")
async def list_parts():
    return {"parts": list(_parts.values()), "total": len(_parts)}


@router.get("/{part_id}")
async def get_part(part_id: str):
    part = _parts.get(part_id)
    if not part:
        return {"part_id": part_id, "status": "not_found", "mode": "mock"}
    return part


@router.post("", status_code=201)
async def create_part(payload: PartCreate):
    part_id = new_part_id()
    part = CircuitSpecificPart(
        part_id=part_id,
        name=payload.name,
        part_type=payload.part_type,
        target_circuit_id=payload.target_circuit_id,
        problem_statement=payload.problem_statement,
        technical_hypothesis=payload.technical_hypothesis,
        expected_impact=payload.expected_impact,
        material=payload.material,
        estimated_weight_g=payload.estimated_weight_g,
        manufacturing_method=payload.manufacturing_method,
        risk_level=payload.risk_level,
        status="concept",
        approval_status="pending",
    )
    _parts[part_id] = part
    return part


@router.patch("/{part_id}/status")
async def update_part_status(part_id: str, payload: dict):
    part = _parts.get(part_id)
    if not part:
        return {"part_id": part_id, "status": "not_found"}
    new_status = payload.get("status", part.status)
    part.status = new_status
    return {"part_id": part_id, "status": new_status}


@router.post("/{part_id}/simulate")
async def simulate_part(part_id: str, payload: dict):
    return {
        "part_id": part_id,
        "simulation_requested": True,
        "payload": payload,
        "status": "queued",
        "simulation_id": f"sim-{part_id[:8]}",
    }
