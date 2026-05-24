import json
import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from race_command_center.database import get_session
from race_command_center.models.setup import BikeSetup, SetupDiff
from race_command_center.utils.time import utcnow_iso

router = APIRouter()
logger = logging.getLogger(__name__)

_SETUP_COLS = [f for f in BikeSetup.model_fields if f not in ("custom_parts",)]


def _row_to_setup(row) -> BikeSetup:
    d = dict(row._mapping)
    d["custom_parts"] = json.loads(d.get("custom_parts") or "[]")
    return BikeSetup(**d)


@router.get("")
async def list_setups(db: AsyncSession = Depends(get_session)):
    result = await db.execute(text("SELECT * FROM setups ORDER BY created_at DESC"))
    rows = result.fetchall()
    setups = [_row_to_setup(r) for r in rows]
    return {"setups": setups, "total": len(setups)}


@router.get("/diff/{baseline_id}/{proposed_id}")
async def setup_diff(baseline_id: str, proposed_id: str, db: AsyncSession = Depends(get_session)):
    b_row = (await db.execute(text("SELECT * FROM setups WHERE setup_id = :id"), {"id": baseline_id})).fetchone()
    p_row = (await db.execute(text("SELECT * FROM setups WHERE setup_id = :id"), {"id": proposed_id})).fetchone()
    if not b_row or not p_row:
        raise HTTPException(status_code=404, detail="One or both setups not found")

    baseline = _row_to_setup(b_row)
    proposed = _row_to_setup(p_row)
    changes = []
    for field in BikeSetup.model_fields:
        bval = getattr(baseline, field)
        pval = getattr(proposed, field)
        if bval != pval:
            changes.append({"field": field, "baseline": bval, "proposed": pval})

    return SetupDiff(
        baseline_setup_id=baseline_id,
        proposed_setup_id=proposed_id,
        changes=changes,
        risk_level="medium" if changes else "low",
        summary=f"{len(changes)} parameter(s) changed",
    )


@router.get("/{setup_id}")
async def get_setup(setup_id: str, db: AsyncSession = Depends(get_session)):
    result = await db.execute(text("SELECT * FROM setups WHERE setup_id = :id"), {"id": setup_id})
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail=f"Setup {setup_id!r} not found")
    return _row_to_setup(row)


@router.post("", status_code=201)
async def create_setup(payload: BikeSetup, db: AsyncSession = Depends(get_session)):
    now = utcnow_iso()
    data = payload.model_dump()
    data["custom_parts"] = json.dumps(data.get("custom_parts", []))
    data["created_at"] = now
    data["updated_at"] = now

    cols = list(data.keys())
    placeholders = ", ".join(f":{c}" for c in cols)
    col_names = ", ".join(cols)

    await db.execute(
        text(f"INSERT INTO setups ({col_names}) VALUES ({placeholders}) ON CONFLICT(setup_id) DO NOTHING"),
        data,
    )
    await db.commit()
    logger.info("Setup created: %s (%s)", payload.setup_id, payload.name)
    return payload
