# 15 Race Command Center

Race Engineering Operating System for the KDD + agents + Docker + Kubernetes
architecture described in the paper.

This repository is the final operating layer of the project. It acts as:

- Main dashboard for the paper evidence.
- Launcher for the full service stack.
- Crew chief interface.
- Pre-Grand Prix analysis workbench.
- Circuit-specific parts design studio.
- High-frequency telemetry console.
- Pattern discovery tool.
- Exploitation layer for Edge AI, KDD pipelines, agents, RAG/CAG, MCP and observability.

## Quick Start

```bash
make start
```

or:

```bash
docker compose -f docker-compose.full-stack.yml up -d --build
```

The full stack is designed to launch:

- Orchestrator
- MCP Gateway
- RAG/CAG Knowledge Layer
- Skills Registry
- Documentation Agent
- KDD Data Pipelines
- Redpanda
- Flink
- Qdrant
- PostgreSQL
- MinIO
- OpenTelemetry
- Prometheus
- Grafana
- Race Command Center Dashboard

For Kubernetes:

```bash
make deploy-k8s
```

## Core Modules

- `apps/web-dashboard`: main paper dashboard and system status surface.
- `apps/crew-chief-console`: setup decisions, approvals and risk review.
- `apps/pre-gp-workbench`: pre-Grand Prix preparation workflow.
- `apps/telemetry-live-viewer`: high-frequency telemetry cockpit.
- `apps/setup-change-simulator`: setup comparison and what-if analysis.
- `apps/track-pattern-explorer`: pattern discovery UI.
- `apps/parts-design-studio`: circuit-specific parts design workflow.
- `models/ekf`: sensor fusion and state estimation.
- `models/curve-segmentation`: braking/apex/drive micro-segmentation.
- `models/tire-degradation`: tire collapse risk estimation.
- `models/pattern-mining`: clustering, sequence mining and explainability.

## Paper Fit

The command center demonstrates the feasibility of AI in edge-like racing
engineering conditions with constraints in latency, energy, memory and
operational utility. It closes the loop:

```text
telemetry -> pattern -> hypothesis -> setup or part change -> validation -> evidence
```

