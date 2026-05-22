from fastapi import APIRouter
from race_command_center.models.setup import BikeSetup, SetupDiff
from race_command_center.utils.ids import new_id

router = APIRouter()

_setups: dict[str, BikeSetup] = {
    "setup-base-jerez": BikeSetup(
        setup_id="setup-base-jerez",
        name="Baseline Jerez",
        front_preload=12.0, rear_preload=14.0,
        front_compression=18.0, rear_compression=20.0,
        front_rebound=16.0, rear_rebound=18.0,
        engine_map="map-1", traction_control_map="tc-3",
        anti_wheelie_map="aw-2", engine_brake_map="eb-2",
        front_tire_pressure=1.95, rear_tire_pressure=1.85,
        front_compound="medium", rear_compound="soft",
        aero_package="A", status="approved",
    ),
    "setup-q-jerez": BikeSetup(
        setup_id="setup-q-jerez",
        name="Qualifying Jerez",
        front_preload=12.0, rear_preload=15.0,
        front_compression=18.0, rear_compression=21.0,
        front_rebound=16.0, rear_rebound=20.0,
        engine_map="map-2", traction_control_map="tc-2",
        anti_wheelie_map="aw-1", engine_brake_map="eb-2",
        front_tire_pressure=1.90, rear_tire_pressure=1.80,
        front_compound="soft", rear_compound="soft",
        aero_package="A", status="proposed",
    ),
}


@router.get("")
async def list_setups():
    return {"setups": list(_setups.values()), "total": len(_setups)}


@router.get("/{setup_id}")
async def get_setup(setup_id: str):
    setup = _setups.get(setup_id)
    if not setup:
        return {"setup_id": setup_id, "status": "not_found", "mode": "mock"}
    return setup


@router.post("", status_code=201)
async def create_setup(payload: BikeSetup):
    _setups[payload.setup_id] = payload
    return payload


@router.get("/diff/{baseline_id}/{proposed_id}")
async def setup_diff(baseline_id: str, proposed_id: str):
    baseline = _setups.get(baseline_id)
    proposed = _setups.get(proposed_id)
    if not baseline or not proposed:
        return {"changes": [], "mode": "mock", "note": "setup not found"}

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
