"""Engine-Brake (AEB) map import endpoint — Spec §8.2 ECU / Freno Motor."""

import logging
import tempfile
from pathlib import Path

from fastapi import APIRouter, HTTPException, UploadFile

from race_command_center.importers.engine_brake import parse_engine_brake_workbook

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/import")
async def import_engine_brake(file: UploadFile) -> dict:
    """Parse an uploaded EB Tool ``.xlsm`` into engine-brake maps per gear."""
    name = file.filename or "EB_Tool.xlsm"
    if not name.lower().endswith((".xlsm", ".xlsx")):
        raise HTTPException(status_code=400, detail="Expected an EB Tool .xlsm/.xlsx file")

    tmp_path: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(name).suffix) as tmp:
            tmp.write(await file.read())
            tmp_path = Path(tmp.name)
        result = parse_engine_brake_workbook(tmp_path)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    finally:
        if tmp_path is not None and tmp_path.exists():
            tmp_path.unlink(missing_ok=True)

    logger.info("Imported engine-brake map %s: %d gears", result["model"], result["gear_count"])
    return result
