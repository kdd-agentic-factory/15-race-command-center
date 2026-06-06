"""Tests for the rider voice-debrief NLP interpreter — T11 / Spec §12."""

from __future__ import annotations

from race_command_center.services import rider_debrief


def test_interpret_understeer_braking_corner():
    # The spec's worked example.
    d = rider_debrief.interpret("Tengo subviraje severo al soltar el freno en la curva 4")
    assert "understeer" in d["issues"]
    assert "braking" in d["phases"]
    assert d["severity"] == "severe"
    assert 4 in d["corners"]


def test_recommendations_segmented_by_staff():
    interp = rider_debrief.interpret("subviraje en la frenada")
    rec = rider_debrief.recommendations(interp)
    assert rec["suspension"] and rec["chassis"]
    assert any("front" in r.lower() for r in rec["suspension"])


def test_oversteer_exit_electronics():
    d = rider_debrief.debrief("sobreviraje en la salida de curva, patina mucho")
    assert "oversteer" in d["interpretation"]["issues"]
    assert "exit" in d["interpretation"]["phases"]
    assert d["recommendations"]["electronics"]  # TC / power map
    assert "patina" or "spin" in str(d["interpretation"]["issues"])


def test_no_issue_logs_gracefully():
    d = rider_debrief.debrief("la moto va perfecta, muy contento")
    assert d["interpretation"]["issues"] == []
    assert "knowledge base" in d["summary"]


def test_debrief_endpoint_and_repository():
    from fastapi.testclient import TestClient

    from race_command_center.main import app

    client = TestClient(app)
    r = client.post("/api/v1/rider-voice/debrief",
                    json={"transcript": "chatter en la curva 7 al entrar", "rider": "PG9"})
    assert r.status_code == 200, r.text
    body = r.json()
    assert "chatter" in body["interpretation"]["issues"]
    assert body["recommendations"]["suspension"]
    lst = client.get("/api/v1/rider-voice/debriefs").json()
    assert lst["total"] >= 1
