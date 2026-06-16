from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from race_command_center.database import get_session
from race_command_center.models.report import Report, ReportRequest
from race_command_center.services.governance_reporting import (
    count_report_snapshots,
    get_report_snapshot,
    list_report_snapshots,
    persist_report_snapshot,
)
from race_command_center.utils.ids import new_report_id
from race_command_center.utils.time import utcnow_iso

router = APIRouter()

REPORT_TYPES = [
    "crew_chief_report", "setup_change_report", "telemetry_evidence_report",
    "simulation_report", "pre_gp_report", "post_session_report", "paper_evidence_export",
]


@router.get("")
async def list_reports(db: AsyncSession = Depends(get_session)):
    reports = await list_report_snapshots(db=db)
    return {"reports": reports, "total": await count_report_snapshots(db=db), "report_types": REPORT_TYPES}


@router.post("", status_code=201)
async def generate_report(payload: ReportRequest, db: AsyncSession = Depends(get_session)):
    report_id = new_report_id()
    title_map = {
        "crew_chief_report": "Crew Chief Session Report",
        "pre_gp_report": "Pre-Grand Prix Preparation Report",
        "post_session_report": "Post-Session Analysis Report",
        "paper_evidence_export": "Paper Evidence Export",
    }
    report = Report(
        report_id=report_id,
        report_type=payload.report_type,
        title=title_map.get(payload.report_type, f"Report: {payload.report_type}"),
        session_id=payload.session_id,
        circuit_id=payload.circuit_id,
        status="generated",
        created_at=utcnow_iso(),
        summary=f"Auto-generated {payload.report_type} report. Connect documentation agent for full content.",
        sections=[
            {"id": "summary", "title": "Executive Summary", "content": "Mock content."},
            {"id": "telemetry", "title": "Telemetry Analysis", "content": "Mock content."},
            {"id": "decisions", "title": "Decisions & Actions", "content": "Mock content."},
        ],
        evidence=[
            {"source": "telemetry-session-api", "type": "session_telemetry", "confidence": 0.9},
        ] if payload.include_evidence else [],
        mode="mock",
    )
    await persist_report_snapshot(report, db=db)
    await db.commit()
    return report


@router.get("/{report_id}")
async def get_report(report_id: str, db: AsyncSession = Depends(get_session)):
    report = await get_report_snapshot(report_id, db=db)
    if not report:
        return {"report_id": report_id, "status": "not_found"}
    return report
