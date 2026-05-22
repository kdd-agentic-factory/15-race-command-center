import pytest
from race_command_center.utils.risk import classify_spin_risk, classify_tire_risk, highest_risk


def test_spin_risk_low():
    assert classify_spin_risk(0.02) == "low"


def test_spin_risk_medium():
    assert classify_spin_risk(0.05) == "medium"


def test_spin_risk_high():
    assert classify_spin_risk(0.07) == "high"


def test_spin_risk_critical():
    assert classify_spin_risk(0.10) == "critical"


def test_tire_risk_low():
    assert classify_tire_risk(106) == "low"


def test_tire_risk_medium():
    assert classify_tire_risk(114) == "medium"


def test_tire_risk_high():
    assert classify_tire_risk(122) == "high"


def test_tire_risk_critical():
    assert classify_tire_risk(130) == "critical"


def test_highest_risk_selects_max():
    assert highest_risk("low", "medium", "high") == "high"
    assert highest_risk("low", "low") == "low"
    assert highest_risk("critical", "medium") == "critical"


def test_highest_risk_empty():
    assert highest_risk() == "low"
