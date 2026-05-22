# Race Command Center — API Contract

## Base URL

```
http://localhost:8150
```

## Endpoints

### Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Service health check |
| GET | `/health/ready` | Readiness probe |

### Sessions

| Method | Path | Description |
|--------|------|-------------|
| GET | `/sessions` | List sessions |
| POST | `/sessions` | Create session |
| GET | `/sessions/{id}` | Get session |
| POST | `/sessions/{id}/close` | Close session |

### Telemetry

| Method | Path | Description |
|--------|------|-------------|
| GET | `/telemetry/mock` | Get mock telemetry sample |
| GET | `/telemetry/mock/batch` | Get batch of mock samples |
| WS | `/ws/telemetry` | WebSocket stream (10 Hz) |

### Parts

| Method | Path | Description |
|--------|------|-------------|
| GET | `/parts` | List parts |
| POST | `/parts` | Create part |
| GET | `/parts/{id}` | Get part |
| PATCH | `/parts/{id}/status` | Update part status |
| POST | `/parts/{id}/simulate` | Queue part simulation |

### Decisions

| Method | Path | Description |
|--------|------|-------------|
| GET | `/decisions` | List decisions |
| POST | `/decisions` | Create decision |
| POST | `/decisions/{id}/approve` | Approve decision |
| POST | `/decisions/{id}/reject` | Reject decision |
| POST | `/decisions/{id}/request-simulation` | Request simulation |

### Simulation

| Method | Path | Description |
|--------|------|-------------|
| POST | `/simulation/what-if` | Run what-if simulation |
| GET | `/simulation/{id}` | Get simulation result |
| GET | `/simulation` | List simulations |

### Copilot

| Method | Path | Description |
|--------|------|-------------|
| POST | `/copilot/ask` | Ask copilot question |
| GET | `/copilot/status` | Copilot service status |

### Pre-Grand Prix

| Method | Path | Description |
|--------|------|-------------|
| GET | `/pre-gp/workspace/{circuit_id}` | Get pre-GP workspace |
| POST | `/pre-gp/workspace/{circuit_id}/generate-report` | Generate pre-GP report |

### Reports

| Method | Path | Description |
|--------|------|-------------|
| GET | `/reports` | List reports |
| POST | `/reports` | Generate report |
| GET | `/reports/{id}` | Get report |
