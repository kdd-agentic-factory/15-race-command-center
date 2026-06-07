"""Weekend Schedule — dynamic contingency planner (Spec §9).

The static weekend timetable becomes an interactive, highly-compartmentalised tool
that *re-plans session by session*. When something unexpected happens — rain, a
dirty/oily track, low grip, heat, or a session delay — the planner recomputes the
validation priorities and re-allocates the remaining minutes block by block, so the
crew always works the highest-value tasks in the time left.

Pure-logic (no DB, no I/O) so it is trivially testable and can run in an Edge
Function near the circuit.

A *task* is a dict::

    {"name": str, "category": str, "priority": 1..5 (1=critical),
     "minutes": int, "tags": [str, ...]}

``category``/``tags`` drive the contingency rules (e.g. a ``wet`` tag is boosted
when it rains; a ``top_speed`` tag is dropped on a low-grip track).
"""

from __future__ import annotations

from typing import Any

# Each event boosts some categories/tags (priority moves toward critical) and
# demotes others (toward optional), plus a one-line rationale.
_RULES: dict[str, dict[str, Any]] = {
    "rain": {
        "boost": {"wet", "electronics", "rain_tyre", "wet_setup", "traction"},
        "drop": {"dry_aero", "top_speed", "qualifying_sim", "soft_tyre"},
        "note": "Rain — wet setup, rain tyres and traction maps become critical; dry aero / qualifying sims deferred.",
    },
    "dirty_track": {
        "boost": {"suspension", "tyre", "traction", "mechanical_grip"},
        "drop": {"top_speed", "aero_efficiency"},
        "note": "Dirty track — chase mechanical grip (suspension, tyres, TC); skip top-speed / aero runs.",
    },
    "oil_spill": {
        "boost": {"suspension", "tyre", "traction", "safety"},
        "drop": {"top_speed", "aero_efficiency", "qualifying_sim"},
        "note": "Oil on track — safety + mechanical-grip work first; high-speed validation paused.",
    },
    "low_grip": {
        "boost": {"tyre", "suspension", "traction", "tyre_thermal"},
        "drop": {"top_speed", "qualifying_sim"},
        "note": "Low grip — tyre/thermal and traction work prioritised over outright pace runs.",
    },
    "heat": {
        "boost": {"cooling", "tyre_thermal", "pressure", "tyre"},
        "drop": {"qualifying_sim"},
        "note": "High temperatures — cooling, tyre-thermal and pressure validation boosted.",
    },
    "session_delay": {
        "boost": set(),
        "drop": set(),
        "note": "Session delayed — time compressed; only critical/high-priority blocks retained.",
    },
}

_MIN_PRIO, _MAX_PRIO = 1, 5


def _clamp(p: int) -> int:
    return max(_MIN_PRIO, min(_MAX_PRIO, p))


def _adjusted_priority(task: dict[str, Any], rule: dict[str, Any]) -> int:
    tags = set(task.get("tags", [])) | {task.get("category", "")}
    p = int(task["priority"])
    if tags & rule["boost"]:
        p -= 2
    if tags & rule["drop"]:
        p += 2
    return _clamp(p)


def replan_weekend(
    tasks: list[dict[str, Any]],
    event: str,
    remaining_minutes: int,
    *,
    severity: float = 1.0,
) -> dict[str, Any]:
    """Re-prioritise and re-allocate the remaining session minutes for an event.

    Returns the revised ordered plan (scheduled vs deferred), a change log, the
    minute allocation and a human rationale.
    """
    if event not in _RULES:
        raise ValueError(f"unknown event '{event}'. Known: {sorted(_RULES)}")
    if remaining_minutes <= 0:
        raise ValueError("remaining_minutes must be > 0")
    rule = _RULES[event]

    ranked = []
    for idx, task in enumerate(tasks):
        new_p = _adjusted_priority(task, rule)
        ranked.append({**task, "orig_priority": int(task["priority"]),
                       "priority": new_p, "_order": idx})

    # session_delay severity tightens the cutoff: only keep the most critical.
    keep_below = 5
    if event == "session_delay":
        keep_below = 2 if severity >= 0.66 else 3

    # critical first; within a tier bank the shortest blocks first so the most
    # high-value validations get done in the time left (original order breaks ties).
    ranked.sort(key=lambda t: (t["priority"], t["minutes"], t["_order"]))

    scheduled, deferred = [], []
    used = 0
    for task in ranked:
        fits = used + task["minutes"] <= remaining_minutes
        if task["priority"] <= keep_below and fits:
            scheduled.append(task)
            used += task["minutes"]
        else:
            reason = "out of time" if not fits else "deprioritised by contingency"
            deferred.append({**task, "defer_reason": reason})

    changes = []
    for task in ranked:
        if task["priority"] != task["orig_priority"]:
            direction = "raised" if task["priority"] < task["orig_priority"] else "lowered"
            changes.append({
                "task": task["name"],
                "change": f"{direction} {task['orig_priority']}→{task['priority']}",
            })

    return {
        "event": event,
        "severity": severity,
        "remaining_minutes": remaining_minutes,
        "allocated_minutes": used,
        "free_minutes": remaining_minutes - used,
        "scheduled": [
            {"name": t["name"], "category": t.get("category"), "priority": t["priority"],
             "minutes": t["minutes"]}
            for t in scheduled
        ],
        "deferred": [
            {"name": t["name"], "priority": t["priority"], "reason": t["defer_reason"]}
            for t in deferred
        ],
        "changes": changes,
        "rationale": rule["note"],
        "conclusion": (
            f"{rule['note']} Scheduled {len(scheduled)} block(s) using {used}/{remaining_minutes} min; "
            f"deferred {len(deferred)}."
        ),
    }
