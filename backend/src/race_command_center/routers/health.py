import logging

from fastapi import APIRouter
from sqlalchemy import text

from race_command_center.database import AsyncSessionLocal

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/health")
async def health():
    db_ok = False
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
            db_ok = True
    except Exception as exc:
        logger.warning("DB health check failed: %s", exc)

    return {
        "status": "ok" if db_ok else "degraded",
        "service": "race-command-center",
        "version": "0.2.0",
        "dependencies": {"database": "ok" if db_ok else "unavailable"},
    }


@router.get("/health/ready")
async def readiness():
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
        return {"ready": True}
    except Exception:
        return {"ready": False}, 503
