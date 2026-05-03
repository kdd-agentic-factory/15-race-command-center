# Web Dashboard

Operational real-time Race Command Center dashboard.

## AI Copilot

The `AI Copilot` tab calls `16-race-ai-copilot` through:

```text
/copilot-api/integrations/race-command-center/chat
```

The dashboard nginx container proxies `/copilot-api` to the `race-ai-copilot-api`
service. The request contract is mirrored in
`data-contracts/ai-copilot-panel.schema.yaml` and includes session, circuit,
stint, setup and live telemetry context.

Run locally:

```powershell
python -m http.server 8090 -d apps/web-dashboard
```

Open:

```text
http://localhost:8090
```

For the copilot-backed flow, use `make start-race`, `make start-local-stack` or
`make start` so nginx can proxy requests to the copilot API.
