from fastapi import APIRouter
from race_command_center.models.report import Report, ReportRequest
from race_command_center.utils.ids import new_report_id
from race_command_center.utils.time import utcnow_iso

router = APIRouter()

_reports: dict[str, Report] = {}

REPORT_TYPES = [
    "crew_chief_report", "setup_change_report", "telemetry_evidence_report",
    "simulation_report", "pre_gp_report", "post_session_report", "paper_evidence_export",
]


@router.get("")
async def list_reports():
    return {"reports": list(_reports.values()), "total": len(_reports), "report_types": REPORT_TYPES}


@router.post("", status_code=201)
async def generate_report(payload: ReportRequest):
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
    _reports[report_id] = report
    return report


@router.get("/{report_id}")
async def get_report(report_id: str):
    report = _reports.get(report_id)
    if not report:
        return {"report_id": report_id, "status": "not_found"}
    return report
