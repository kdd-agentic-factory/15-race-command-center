from __future__ import annotations

from typing import Any

import pytest

from race_command_center.routers import copilot as copilot_router


class _FakeResponse:
    def __init__(self, payload: dict[str, Any]):
        self._payload = payload

    def raise_for_status(self) -> None:
        return None

    def json(self) -> dict[str, Any]:
        return self._payload


class _FakeAsyncClient:
    def __init__(self, *args: Any, **kwargs: Any):
        self.calls: list[tuple[str, dict[str, Any] | None]] = []

    async def __aenter__(self) -> "_FakeAsyncClient":
        return self

    async def __aexit__(self, exc_type, exc, tb) -> None:
        return None

    async def post(self, url: str, json: dict[str, Any] | None = None) -> _FakeResponse:
        self.calls.append((url, json))
        payload = {
            "message": "Blueprint design brief routed via command-center integration",
            "evidence": [{"source": "race-command-center:context", "type": "session", "confidence": 0.0}],
            "tool_calls": [
                {"tool": "race_command_center.context.read", "status": "proposed", "approval_required": False},
                {"tool": "agent_orchestrator.plan", "status": "proposed", "approval_required": True},
                {"tool": "mcp_gateway.dispatch", "status": "proposed", "approval_required": True},
            ],
            "approval": {"required": True},
            "recommendations": [{"type": "part_design", "summary": "Blueprint brief ready", "risk": "high", "approval_required": True}],
            "next_step": "Submit the proposed route through the governed approval path before any setup or part change is executed.",
        }
        return _FakeResponse(payload)


@pytest.mark.asyncio
async def test_blueprint_request_routes_to_command_center_integration(monkeypatch):
    fake_client = _FakeAsyncClient()
    monkeypatch.setattr(copilot_router.httpx, "AsyncClient", lambda *args, **kwargs: fake_client)

    body = await copilot_router.ask_copilot(
        {
            "question": "Generate a Blueprint design brief for the rear tire cooling duct.",
            "intent": "blueprint_design_brief",
            "source": "parts_design_page",
            "part_context": {
                "part_id": "part-tire-duct",
                "name": "Rear Tire Cooling Duct",
                "part_type": "Thermal Management",
            },
        }
    )

    assert body["mode"] == "blueprint_bridge"
    assert body["approval_status"] == "required"
    assert body["requires_approval"] is True
    assert body["answer"].startswith("Blueprint design brief routed")
    assert fake_client.calls[0][0].endswith("/api/v1/integrations/race-command-center/chat")
    assert fake_client.calls[0][1]["reporting"]["report_type"] == "blueprint_design_brief"
    assert fake_client.calls[0][1]["vehicle_context"]["part_context"]["part_id"] == "part-tire-duct"


@pytest.mark.asyncio
async def test_non_blueprint_request_preserves_existing_chat_route(monkeypatch):
    fake_client = _FakeAsyncClient()
    monkeypatch.setattr(copilot_router.httpx, "AsyncClient", lambda *args, **kwargs: fake_client)

    response = await copilot_router.ask_copilot({"question": "Summarize the latest stint deltas for Jerez"})

    assert fake_client.calls[0][0].endswith("/api/v1/chat")
