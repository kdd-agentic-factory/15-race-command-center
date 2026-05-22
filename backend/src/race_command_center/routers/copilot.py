from fastapi import APIRouter

router = APIRouter()

_MOCK_ANSWERS = {
    "tire": "Rear tire carcass temperature has risen 14°C above baseline over the last 3 laps. Drive phase spin ratio is averaging 0.078 — above the 0.06 watch threshold. Recommend switching to Engine Map 2 and reducing torque delivery at T5 and T13.",
    "setup": "Baseline vs qualifying setup shows 4 parameter changes: rear preload +1 click, rear rebound +2 clicks, engine map 1→2, TC map 3→2. Estimated lap delta: -0.18s. Risk: medium. Simulation required before approval.",
    "parts": "For the rear tire cooling duct at Jerez: simulation shows 11°C mean carcass temperature reduction in long drive phases. Estimated spin ratio reduction of 0.012. Risk: medium. Status: simulated. Requires crew chief approval before manufacturing.",
}


@router.post("/ask")
async def ask_copilot(payload: dict):
    question = payload.get("question", payload.get("query", ""))
    q_lower = question.lower()

    if "tire" in q_lower or "neumatico" in q_lower or "degradacion" in q_lower:
        answer = _MOCK_ANSWERS["tire"]
    elif "setup" in q_lower or "compare" in q_lower or "rebound" in q_lower:
        answer = _MOCK_ANSWERS["setup"]
    elif "part" in q_lower or "pieza" in q_lower or "duct" in q_lower:
        answer = _MOCK_ANSWERS["parts"]
    else:
        answer = (
            "Evidence-grounded analysis from Race AI Copilot (mock mode). "
            "Connect to 16-race-ai-copilot service for live RAG/CAG responses."
        )

    return {
        "question": question,
        "answer": answer,
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
        "mode": "mock",
    }


@router.get("/status")
async def copilot_status():
    return {
        "service": "race-ai-copilot",
        "status": "mock",
        "mode": "mock",
        "tools_available": 5,
    }
