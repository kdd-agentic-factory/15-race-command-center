"""Tests for the structured Setup Impact Estimator — T8 / Spec §8.1."""

from __future__ import annotations

import pytest

from race_command_center.models.suspension import (
    ClickParam, ForkSettings, PreloadParam, ShockSettings, SuspensionSetup,
)
from race_command_center.services import setup_impact


def _setup(setup_id: str, fc: int, fr: int, rc: int, rr: int, fp: float = 0.5) -> SuspensionSetup:
    return SuspensionSetup(
        setup_id=setup_id,
        fork=ForkSettings(
            preload=PreloadParam(turns=fp, max_turns=3),
            compression=ClickParam(clicks=fc, max_clicks=20),
            rebound=ClickParam(clicks=fr, max_clicks=20),
            spring_rate_nmm=9.5, oil_level_mm=130,
        ),
        shock=ShockSettings(
            preload=PreloadParam(turns=0.25, max_turns=5),
            low_speed_compression=ClickParam(clicks=rc, max_clicks=15),
            high_speed_compression=ClickParam(clicks=2, max_clicks=8),
            rebound=ClickParam(clicks=rr, max_clicks=15),
            spring_rate_nmm=95,
        ),
    )


def test_click_hardness_scale():
    assert ClickParam(clicks=1, max_clicks=20).hardness == 1.0      # closed = hardest
    assert ClickParam(clicks=20, max_clicks=20).hardness == 0.0     # open = softest
    assert ClickParam(clicks=1, max_clicks=1).hardness == 1.0


def test_preload_quarter_steps():
    PreloadParam(turns=0.75)
    with pytest.raises(ValueError):
        PreloadParam(turns=0.3)


def test_estimate_profile():
    e = setup_impact.estimate(_setup("s1", fc=5, fr=10, rc=7, rr=6))
    assert 0 < e["front_hardness"] < 1
    assert e["balance_label"] in {"front-biased", "rear-biased", "neutral"}
    params = {r["param"] for r in e["clicks_range_table"]}
    assert {"front_compression", "rear_low_speed_compression", "rear_high_speed_compression"} <= params
    fc = next(r for r in e["clicks_range_table"] if r["param"] == "front_compression")
    assert fc["range"] == "1..20" and fc["hardness"] == pytest.approx((20 - 5) / 19, abs=1e-3)


def test_compare_changes_and_notes():
    base = _setup("base", fc=8, fr=10, rc=7, rr=6)
    prop = _setup("prop", fc=5, fr=10, rc=9, rr=6)  # front comp harder, rear LSC softer
    c = setup_impact.compare(base, prop)
    by = {ch["param"]: ch for ch in c["changes"] if "delta_clicks" in ch}
    assert by["front_compression"]["delta_clicks"] == -3   # toward closed = harder
    assert by["rear_low_speed_compression"]["delta_clicks"] == 2
    assert c["change_count"] >= 2
    assert any("front_compression" in n for n in c["impact_notes"])
