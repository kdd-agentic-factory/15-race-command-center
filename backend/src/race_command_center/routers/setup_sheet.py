"""Digital setup-sheet endpoints — Spec §8 (Setup Management & Engineering Portal)."""

import logging
import tempfile
from pathlib import Path

from fastapi import APIRouter, HTTPException, UploadFile

from race_command_center.importers.setup_sheet import parse_setup_sheet

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/import")
async def import_setup_sheet(file: UploadFile) -> dict:
    """Parse an uploaded bike setup-sheet ``.xlsx`` into structured categories."""
    name = file.filename or "setup_sheet.xlsx"
    if not name.lower().endswith((".xlsx", ".xlsm")):
        raise HTTPException(status_code=400, detail="Expected a setup-sheet .xlsx/.xlsm file")

    tmp_path: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(name).suffix) as tmp:
            tmp.write(await file.read())
            tmp_path = Path(tmp.name)
        result = parse_setup_sheet(tmp_path)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    finally:
        if tmp_path is not None and tmp_path.exists():
            tmp_path.unlink(missing_ok=True)

    logger.info("Imported setup sheet %s: %d categories", result["source_file"], result["category_count"])
    return result
