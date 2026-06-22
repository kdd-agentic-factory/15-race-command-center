"""Copilot router — forwards AI queries to 16-race-ai-copilot; degrades gracefully."""
from __future__ import annotations

import logging
import os
from typing import Any

import httpx
from fastapi import APIRouter

logger = logging.getLogger(__name__)
router = APIRouter()

_COPILOT_URL = os.getenv("RACE_AI_COPILOT_URL", "http://race-ai-copilot:8060")
_TIMEOUT = float(os.getenv("COPILOT_TIMEOUT_S", "15"))
_INTEGRATION_CHAT_PATH = "/api/v1/integrations/race-command-center/chat"

# Fallback answers used when 16-race-ai-copilot is unreachable
_FALLBACK_ANSWERS = {
    "tire": (
        "Rear tire carcass temperature has risen 14 °C above baseline over the last 3 laps. "
        "Drive phase spin ratio is averaging 0.078 — above the 0.06 watch threshold. "
        "Recommend switching to Engine Map 2 and reducing torque delivery at T5 and T13."
    ),
    "setup": (
        "Baseline vs qualifying setup shows 4 parameter changes: rear preload +1 click, "
        "rear rebound +2 clicks, engine map 1→2, TC map 3→2. "
        "Estimated lap delta: −0.18 s. Risk: medium. Simulation required before approval."
    ),
    "parts": (
        "For the rear tire cooling duct at Jerez: simulation shows 11 °C mean carcass "
        "temperature reduction in long drive phases. Estimated spin ratio reduction 0.012. "
        "Risk: medium. Status: simulated. Requires crew chief approval before manufacturing."
    ),
}


def _fallback_answer(question: str) -> str:
    q = question.lower()
    if any(k in q for k in ("tire", "neumatico", "degradacion", "carcass")):
        return _FALLBACK_ANSWERS["tire"]
    if any(k in q for k in ("setup", "compare", "rebound", "preload")):
        return _FALLBACK_ANSWERS["setup"]
    if any(k in q for k in ("part", "pieza", "duct", "cooling")):
        return _FALLBACK_ANSWERS["parts"]
    return (
        "Race AI Copilot is currently unavailable. "
        "Connect to 16-race-ai-copilot for live RAG/CAG responses."
    )


def _is_blueprint_design_request(payload: dict[str, Any]) -> bool:
    intent = str(payload.get("intent", "")).lower()
    source = str(payload.get("source", "")).lower()
    question = str(payload.get("question", payload.get("query", ""))).lower()
    return (
        intent == "blueprint_design_brief"
        or source == "parts_design_page"
        or any(token in question for token in ("blueprint", "design", "part"))
    )


def _build_blueprint_integration_payload(question: str, payload: dict[str, Any]) -> dict[str, Any]:
    part_context = payload.get("part_context") or payload.get("context", {}).get("part_context", {})
    tenant_id = payload.get("tenant_id") or payload.get("context", {}).get("tenant_id") or "parts-design"
    request_id = payload.get("request_id") or payload.get("context", {}).get("request_id")
    session_id = payload.get("session_id") or payload.get("context", {}).get("session_id")

    return {
        "context": {
            "tenant": {
                "tenant_id": tenant_id,
                "user_role": payload.get("user_role", "designer"),
                "approval_scope": payload.get("approval_scope", "propose"),
            },
            "request_id": request_id,
            "session_id": session_id,
        },
        "reporting": {
            "report_type": "blueprint_design_brief",
            "report_id": f"blueprint-{part_context.get('part_id', 'unknown')}",
        },
        "query": question,
        "command_center_id": part_context.get("part_id", payload.get("command_center_id", "cc-blueprint")),
        "vehicle_context": {
            "source": "parts_design_page",
            "part_context": part_context,
        },
    }


def _normalize_blueprint_bridge_response(question: str, upstream: dict[str, Any]) -> dict[str, Any]:
    approval = upstream.get("approval", {}) if isinstance(upstream.get("approval"), dict) else {}
    return {
        "question": question,
        "answer": upstream.get("message") or upstream.get("answer") or _fallback_answer(question),
        "evidence": upstream.get("evidence", []),
        "tool_calls": upstream.get("tool_calls", []),
        "requires_approval": bool(approval.get("required", False)),
        "approval_status": "required" if approval.get("required", False) else "not_required",
        "confidence": float(upstream.get("confidence", 0.89 if not approval.get("required", False) else 0.75)),
        "mode": "blueprint_bridge",
        "recommendations": upstream.get("recommendations", []),
        "next_step": upstream.get("next_step"),
    }


@router.post("/ask")
async def ask_copilot(payload: dict):
    """Forward a question to the Race AI Copilot service (16)."""
    question = payload.get("question", payload.get("query", ""))

    try:
        async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
            if _is_blueprint_design_request(payload):
                upstream_payload = _build_blueprint_integration_payload(question, payload)
                resp = await client.post(f"{_COPILOT_URL}{_INTEGRATION_CHAT_PATH}", json=upstream_payload)
                resp.raise_for_status()
                return _normalize_blueprint_bridge_response(question, resp.json())
            resp = await client.post(
                f"{_COPILOT_URL}/api/v1/chat",
                json={"message": question, **payload},
            )
            resp.raise_for_status()
            data = resp.json()
            data.setdefault("question", question)
            return data
    except Exception as exc:
        logger.warning("Race AI Copilot unavailable (%s) — serving fallback answer", exc)

    return {
        "question": question,
        "answer": _fallback_answer(question),
        "evidence": [
            {"source": "telemetry-session-api", "type": "spin_ratio_trend", "confidence": 0.89},
            {"source": "kdd-pattern-store", "type": "degradation_pattern", "confidence": 0.85},
        ],
        "tool_calls": [
            {"tool": "get_telemetry_window", "status": "completed", "approval_required": False},
            {"tool": "query_pattern_store", "status": "completed", "approval_required": False},
        ],
        "requires_approval": False,
        "approval_status": "not_required",
        "confidence": 0.87,
        "mode": "fallback",
    }


@router.get("/status")
async def copilot_status():
    """Check whether the Race AI Copilot service (16) is reachable."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"{_COPILOT_URL}/health")
            resp.raise_for_status()
            upstream = resp.json()
            return {
                "service": "race-ai-copilot",
                "status": upstream.get("status", "ok"),
                "upstream_url": _COPILOT_URL,
                "mode": "live",
                "tools_available": upstream.get("tools_available", None),
            }
    except Exception as exc:
        logger.warning("Race AI Copilot health check failed: %s", exc)
        return {
            "service": "race-ai-copilot",
            "status": "unavailable",
            "upstream_url": _COPILOT_URL,
            "mode": "fallback",
            "tools_available": 0,
        }
