"""Tests for the Weekend Schedule dynamic contingency planner — §9."""

from __future__ import annotations

import pytest

from race_command_center.services import weekend_schedule as ws


def _tasks():
    return [
        {"name": "Dry aero sweep", "category": "aero", "priority": 2, "minutes": 20, "tags": ["dry_aero", "top_speed"]},
        {"name": "Wet setup baseline", "category": "suspension", "priority": 3, "minutes": 25, "tags": ["wet", "wet_setup"]},
        {"name": "Traction map A/B", "category": "electronics", "priority": 3, "minutes": 15, "tags": ["traction"]},
        {"name": "Qualifying sim", "category": "strategy", "priority": 2, "minutes": 20, "tags": ["qualifying_sim"]},
        {"name": "Brake bedding", "category": "chassis", "priority": 1, "minutes": 10, "tags": ["safety"]},
    ]


def test_rain_promotes_wet_and_demotes_dry():
    res = ws.replan_weekend(_tasks(), "rain", remaining_minutes=120)
    sched = {t["name"]: t["priority"] for t in res["scheduled"]}
    # wet setup raised to critical band and scheduled
    assert "Wet setup baseline" in sched
    assert sched["Wet setup baseline"] <= 1
    # dry aero demoted
    names_changed = {c["task"] for c in res["changes"]}
    assert "Dry aero sweep" in names_changed
    assert "Rain" in res["rationale"]


def test_time_budget_defers_lowest_value():
    # only 20 minutes left → critical work fits, optional gets deferred
    res = ws.replan_weekend(_tasks(), "low_grip", remaining_minutes=20)
    assert res["allocated_minutes"] <= 20
    assert len(res["deferred"]) >= 1
    # brake bedding (priority 1) must survive the squeeze
    assert any(t["name"] == "Brake bedding" for t in res["scheduled"])


def test_session_delay_keeps_only_critical():
    res = ws.replan_weekend(_tasks(), "session_delay", remaining_minutes=200, severity=0.9)
    # with high severity only priority<=2 retained
    for t in res["scheduled"]:
        assert t["priority"] <= 2


def test_unknown_event_raises():
    with pytest.raises(ValueError):
        ws.replan_weekend(_tasks(), "earthquake", remaining_minutes=60)


def test_allocation_never_exceeds_budget():
    res = ws.replan_weekend(_tasks(), "heat", remaining_minutes=40)
    assert res["allocated_minutes"] <= 40
    assert res["free_minutes"] == 40 - res["allocated_minutes"]
