from __future__ import annotations

import os
import pathlib

_TEST_DB = pathlib.Path(__file__).with_name("test_governance_reporting_durable.db")
os.environ.setdefault("DATABASE_URL", f"sqlite+aiosqlite:///{_TEST_DB}")
os.environ.setdefault("RATE_LIMIT_PER_MINUTE", "99999")
os.environ.setdefault("INSFORGE_AUTH_ENABLED", "false")
os.environ.setdefault("ENABLE_MOCK_MODE", "true")

import pytest
from fastapi.testclient import TestClient

from race_command_center.auth_deps import Principal, get_current_principal
from race_command_center.main import app
from race_command_center.models.report import Report
from race_command_center.services import governance_reporting as gr


async def _mock_principal() -> Principal:
    return Principal(id="test_runner", role="admin", display_name="Test Runner")


app.dependency_overrides[get_current_principal] = _mock_principal


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c
    _TEST_DB.unlink(missing_ok=True)


def test_report_snapshot_persists_to_db_and_list_reads_back(client):
    gr.reset_history()

    response = client.post(
        "/api/v1/reports",
        json={"report_type": "crew_chief_report", "session_id": "ses-db-1", "circuit_id": "mugello"},
    )
    assert response.status_code == 201, response.text
    report_id = response.json()["report_id"]

    gr.reset_history()
    listed = client.get("/api/v1/reports").json()["reports"]
    assert any(report["report_id"] == report_id for report in listed)

    fetched = client.get(f"/api/v1/reports/{report_id}")
    assert fetched.status_code == 200, fetched.text
    assert fetched.json()["report_id"] == report_id


@pytest.mark.asyncio
async def test_report_snapshot_falls_back_to_memory_without_session():
    gr.reset_history()

    report = Report(
        report_id="rpt-local-1",
        report_type="post_session_report",
        title="Local report",
        session_id="ses-local-1",
        circuit_id="jerez",
        created_at="2026-06-16T00:00:00+00:00",
        summary="Local summary",
        sections=[{"id": "summary", "title": "Summary", "content": "ok"}],
        evidence=[],
        mode="mock",
    )

    await gr.persist_report_snapshot(report)
    items = await gr.list_report_snapshots()

    assert any(item.report_id == "rpt-local-1" for item in items)


def test_governance_action_history_persists_to_db_and_can_be_queried(client):
    gr.reset_history()

    created = client.post(
        "/api/v1/decisions",
        json={
            "decision_id": "dec-db-1",
            "title": "Change engine map",
            "decision_type": "engine_map",
            "risk_level": "medium",
            "proposed_by": "telemetry_agent",
            "status": "proposed",
            "session_id": "ses-db-1",
        },
    )
    assert created.status_code == 201, created.text

    approved = client.post(
        "/api/v1/decisions/dec-db-1/approve",
        json={"notes": "Approved after telemetry review"},
    )
    assert approved.status_code == 200, approved.text

    gr.reset_history()
    history = client.get("/api/v1/decisions/dec-db-1/history")
    assert history.status_code == 200, history.text
    body = history.json()
    assert body["total"] == 1
    assert body["actions"][0]["action_type"] == "approve"
    assert body["actions"][0]["actor"] == "Test Runner"


@pytest.mark.asyncio
async def test_governance_action_falls_back_to_memory_without_session():
    gr.reset_history()

    record = await gr.persist_governance_action(
        decision_id="dec-local-1",
        action_type="reject",
        actor="Test Runner",
        notes="too risky",
        payload={"status": "rejected"},
    )
    items = await gr.list_governance_actions(decision_id="dec-local-1")

    assert items[0]["action_id"] == record["action_id"]
    assert items[0]["action_type"] == "reject"


def test_feedback_entries_persist_to_db_and_list_reads_back(client):
    gr.reset_history()

    response = client.post(
        "/api/v1/rider-voice/debrief",
        json={"transcript": "Subviraje severo en la frenada de la curva 4", "session_id": "ses-fb-1", "rider": "PG9"},
    )
    assert response.status_code == 200, response.text
    feedback_id = response.json()["id"]

    gr.reset_history()
    listed = client.get("/api/v1/rider-voice/debriefs").json()["debriefs"]
    assert any(item["id"] == feedback_id for item in listed)


@pytest.mark.asyncio
async def test_feedback_entries_fall_back_to_memory_without_session():
    gr.reset_history()

    record = await gr.persist_feedback_entry(
        {
            "id": "fb-local-1",
            "session_id": "ses-local-fb",
            "rider": "PG9",
            "feedback_kind": "rider_debrief",
            "summary": "Local feedback",
            "interpretation": {"issues": ["understeer"]},
            "recommendations": {"suspension": ["open front"]},
        }
    )
    items = await gr.list_feedback_entries(session_id="ses-local-fb")

    assert items[0]["id"] == record["id"]
    assert items[0]["feedback_kind"] == "rider_debrief"
