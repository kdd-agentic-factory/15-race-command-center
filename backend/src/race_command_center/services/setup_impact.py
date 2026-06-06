"""Setup Impact Estimator — translates manual clicks to a comparable hardness
scale and produces qualitative impact notes between two suspension setups
(Spec §8.1 + crew-chief notes: "memoria de setups comparables gráficamente").
"""

from __future__ import annotations

from typing import Any

from race_command_center.models.suspension import ClickParam, ShockSettings, SuspensionSetup


def _click_row(label: str, cp: ClickParam | None) -> dict[str, Any] | None:
    if cp is None:
        return None
    return {
        "param": label,
        "clicks": cp.clicks,
        "max_clicks": cp.max_clicks,
        "hardness": cp.hardness,           # 1.0 = hardest (closed)
        "range": f"1..{cp.max_clicks}",
    }


def _shock_compression(shock: ShockSettings) -> ClickParam | None:
    return shock.compression or shock.low_speed_compression or shock.high_speed_compression


def estimate(setup: SuspensionSetup) -> dict[str, Any]:
    """Return a normalised hardness profile + the clicks→range table for a setup."""
    f, s = setup.fork, setup.shock
    rows = [
        _click_row("front_compression", f.compression),
        _click_row("front_rebound", f.rebound),
        _click_row("rear_compression", s.compression),
        _click_row("rear_high_speed_compression", s.high_speed_compression),
        _click_row("rear_low_speed_compression", s.low_speed_compression),
        _click_row("rear_rebound", s.rebound),
    ]
    rows = [r for r in rows if r]

    front_h = (f.compression.hardness + f.rebound.hardness) / 2
    s_comp = _shock_compression(s)
    rear_h = ((s_comp.hardness if s_comp else 0.0) + s.rebound.hardness) / 2
    balance = round(front_h - rear_h, 4)  # >0 → front stiffer than rear

    return {
        "setup_id": setup.setup_id,
        "name": setup.name,
        "front_hardness": round(front_h, 4),
        "rear_hardness": round(rear_h, 4),
        "balance": balance,
        "balance_label": "front-biased" if balance > 0.05 else "rear-biased" if balance < -0.05 else "neutral",
        "front_preload_turns": f.preload.turns,
        "rear_preload_turns": s.preload.turns,
        "front_spring_nmm": f.spring_rate_nmm,
        "rear_spring_nmm": s.spring_rate_nmm,
        "front_oil_level_mm": f.oil_level_mm,
        "clicks_range_table": rows,
    }


# Qualitative engineering heuristics per parameter when it gets HARDER
# (compression/rebound clicks reduced toward 1 / closed).
_HARDER_EFFECT = {
    "front_compression": "less fork dive under braking, more support — but less front grip over bumps",
    "front_rebound": "slower fork return; can pack down on kerbs/bumps, reducing front contact",
    "rear_compression": "less squat on power, more support — harsher over bumps",
    "rear_high_speed_compression": "more control over sharp bumps/kerbs; can spike rear grip loss",
    "rear_low_speed_compression": "less squat on throttle and weight transfer; firmer platform",
    "rear_rebound": "slower shock return; risk of packing down, losing rear grip on exit",
}


def _impact_note(param: str, d_clicks: int) -> str:
    direction = "harder (clicks toward closed)" if d_clicks < 0 else "softer (clicks toward open)"
    base = _HARDER_EFFECT.get(param, "")
    if d_clicks < 0:
        return f"{param} {abs(d_clicks)} clicks {direction}: {base}."
    return f"{param} {abs(d_clicks)} clicks {direction}: opposite of '{base}'."


def compare(baseline: SuspensionSetup, proposed: SuspensionSetup) -> dict[str, Any]:
    """Graph-ready per-parameter deltas + qualitative impact notes."""
    eb, ep = estimate(baseline), estimate(proposed)
    base_rows = {r["param"]: r for r in eb["clicks_range_table"]}
    prop_rows = {r["param"]: r for r in ep["clicks_range_table"]}

    changes: list[dict[str, Any]] = []
    notes: list[str] = []
    for param in sorted(set(base_rows) | set(prop_rows)):
        b, p = base_rows.get(param), prop_rows.get(param)
        if not b or not p:
            continue
        d_clicks = p["clicks"] - b["clicks"]
        d_hard = round(p["hardness"] - b["hardness"], 4)
        if d_clicks == 0:
            continue
        changes.append({
            "param": param,
            "from_clicks": b["clicks"], "to_clicks": p["clicks"], "delta_clicks": d_clicks,
            "delta_hardness": d_hard,
        })
        notes.append(_impact_note(param, d_clicks))

    # preload + spring deltas (graph-ready)
    for label, bk, pk in [
        ("front_preload_turns", eb["front_preload_turns"], ep["front_preload_turns"]),
        ("rear_preload_turns", eb["rear_preload_turns"], ep["rear_preload_turns"]),
        ("front_spring_nmm", eb["front_spring_nmm"], ep["front_spring_nmm"]),
        ("rear_spring_nmm", eb["rear_spring_nmm"], ep["rear_spring_nmm"]),
    ]:
        if bk is not None and pk is not None and bk != pk:
            changes.append({"param": label, "from": bk, "to": pk, "delta": round(pk - bk, 4)})

    return {
        "baseline_setup_id": baseline.setup_id,
        "proposed_setup_id": proposed.setup_id,
        "balance_shift": round(ep["balance"] - eb["balance"], 4),
        "change_count": len(changes),
        "changes": changes,
        "impact_notes": notes,
    }
