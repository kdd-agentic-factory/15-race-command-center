"""Setup Impact Estimator endpoints (Spec §8.1, crew-chief notes)."""

import logging

from fastapi import APIRouter
from pydantic import BaseModel

from race_command_center.models.suspension import SuspensionSetup
from race_command_center.services import setup_impact

router = APIRouter()
logger = logging.getLogger(__name__)


class CompareRequest(BaseModel):
    baseline: SuspensionSetup
    proposed: SuspensionSetup


@router.post("/estimate")
async def estimate_setup(setup: SuspensionSetup) -> dict:
    """Normalised hardness profile + clicks→range table for a suspension setup."""
    return setup_impact.estimate(setup)


@router.post("/compare")
async def compare_setups(payload: CompareRequest) -> dict:
    """Graph-ready per-parameter deltas + qualitative impact notes (setup memory)."""
    return setup_impact.compare(payload.baseline, payload.proposed)
