from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "race-command-center",
        "version": "0.1.0",
    }


@router.get("/health/ready")
async def readiness():
    return {"ready": True}
