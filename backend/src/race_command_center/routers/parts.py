import json
import logging

from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from race_command_center.database import get_session
from race_command_center.models.part import CircuitSpecificPart, PartCreate
from race_command_center.utils.ids import new_part_id
from race_command_center.utils.time import utcnow_iso

router = APIRouter()
logger = logging.getLogger(__name__)


def _row_to_part(row) -> CircuitSpecificPart:
    d = dict(row._mapping)
    meta = json.loads(d.get("metadata") or "{}")
    return CircuitSpecificPart(
        part_id=d["part_id"],
        name=d["name"],
        part_type=d["part_type"],
        status=d.get("status", "concept"),
        target_circuit_id=meta.get("target_circuit_id", d.get("bike_id", "")),
        problem_statement=meta.get("problem_statement", ""),
        technical_hypothesis=meta.get("technical_hypothesis", ""),
        expected_impact=meta.get("expected_impact", ""),
        material=meta.get("material"),
        estimated_weight_g=meta.get("estimated_weight_g"),
        manufacturing_method=meta.get("manufacturing_method"),
        risk_level=meta.get("risk_level", "medium"),
        simulation_id=meta.get("simulation_id"),
        evidence=meta.get("evidence", []),
        approval_status=meta.get("approval_status", "pending"),
        metadata={k: v for k, v in meta.items() if k not in (
            "target_circuit_id", "problem_statement", "technical_hypothesis",
            "expected_impact", "material", "estimated_weight_g", "manufacturing_method",
            "risk_level", "simulation_id", "evidence", "approval_status",
        )},
    )


@router.get("")
async def list_parts(db: AsyncSession = Depends(get_session)):
    result = await db.execute(text("SELECT * FROM parts ORDER BY installed_at DESC NULLS LAST"))
    rows = result.fetchall()
    parts = [_row_to_part(r) for r in rows]
    return {"parts": parts, "total": len(parts)}


@router.get("/{part_id}")
async def get_part(part_id: str, db: AsyncSession = Depends(get_session)):
    result = await db.execute(text("SELECT * FROM parts WHERE part_id = :id"), {"id": part_id})
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail=f"Part {part_id!r} not found")
    return _row_to_part(row)


@router.post("", status_code=201)
async def create_part(payload: PartCreate, db: AsyncSession = Depends(get_session)):
    part_id = new_part_id()
    now = utcnow_iso()
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
    await db.execute(
        text("""
            INSERT INTO parts
                (part_id, bike_id, name, part_type, status, usage_laps, installed_at, metadata)
            VALUES
                (:part_id, :bike_id, :name, :part_type, :status, 0, :installed_at, :metadata)
        """),
        {
            "part_id": part_id,
            "bike_id": payload.target_circuit_id,
            "name": payload.name,
            "part_type": payload.part_type,
            "status": "concept",
            "installed_at": now,
            "metadata": json.dumps({
                "problem_statement": payload.problem_statement,
                "technical_hypothesis": payload.technical_hypothesis,
                "expected_impact": payload.expected_impact,
                "material": payload.material,
                "estimated_weight_g": payload.estimated_weight_g,
                "manufacturing_method": payload.manufacturing_method,
                "risk_level": payload.risk_level,
                "approval_status": "pending",
                "target_circuit_id": payload.target_circuit_id,
            }),
        },
    )
    await db.commit()
    logger.info("Part created: %s (%s)", part_id, payload.name)
    return part


@router.patch("/{part_id}/status")
async def update_part_status(
    part_id: str,
    payload: dict = Body(...),
    db: AsyncSession = Depends(get_session),
):
    new_status = payload.get("status", "unknown")
    result = await db.execute(
        text("UPDATE parts SET status = :status WHERE part_id = :id"),
        {"status": new_status, "id": part_id},
    )
    await db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail=f"Part {part_id!r} not found")
    return {"part_id": part_id, "status": new_status}


@router.post("/{part_id}/simulate")
async def simulate_part(part_id: str, payload: dict = Body(default={}), db: AsyncSession = Depends(get_session)):
    result = await db.execute(text("SELECT part_id FROM parts WHERE part_id = :id"), {"id": part_id})
    if not result.fetchone():
        raise HTTPException(status_code=404, detail=f"Part {part_id!r} not found")
    sim_id = f"sim-{part_id[:8]}"
    # Load current metadata, merge, and write back
    meta_row = (await db.execute(text("SELECT metadata FROM parts WHERE part_id = :id"), {"id": part_id})).fetchone()
    current_meta = json.loads(meta_row[0] or "{}") if meta_row else {}
    current_meta["simulation_id"] = sim_id
    current_meta["simulation_status"] = "queued"
    await db.execute(
        text("UPDATE parts SET metadata = :meta WHERE part_id = :id"),
        {"meta": json.dumps(current_meta), "id": part_id},
    )
    await db.commit()
    return {"part_id": part_id, "simulation_requested": True, "status": "queued", "simulation_id": sim_id}
