# 15 Race Command Center

Race Engineering Operating System for the KDD + agents + Docker + Kubernetes
architecture described in the paper.

This repository is the final operating layer of the project and the global
launcher for the complete repository organization. It acts as:

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

This composes `10-infra-docker/docker-compose.yml`,
`10-infra-docker/docker-compose.observability.yml` and
`15-race-command-center/docker-compose.global.yml`, so the infrastructure,
observability layer, repository surfaces and final race dashboard are launched
from one place.

Alternative local-only race stack:

```bash
make start-race
```

The global stack is designed to launch:

- All 15 repositories as runtime services or visible repository surfaces.
- Orchestrator from the infrastructure stack.
- MCP Gateway from the infrastructure stack.
- RAG/CAG Knowledge Layer from the infrastructure stack.
- Skills Registry from the infrastructure stack.
- Documentation Agent from the infrastructure stack.
- KDD Data Pipelines surface.
- Redpanda
- Qdrant
- PostgreSQL
- MinIO
- OpenTelemetry-compatible endpoint from the infrastructure stack.
- Observability repository surface.
- Race Command Center Dashboard

Useful commands:

```bash
make ps
make logs
make validate-global
```

On Windows, the same launch path is available with:

```powershell
.\scripts\start-all.ps1
```

For Kubernetes:

```bash
make deploy-k8s
```

This applies the available Kubernetes assets from `11-infra-kubernetes`,
`01-agent-orchestrator`, `03-rag-cag-knowledge-layer` and this repository.

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

## Repository Organization

The command center operates the definitive organization:

- `00-kdd-governance`: governance and policies.
- `01-agent-orchestrator`: multi-agent orchestrator.
- `02-mcp-gateway`: tool connectivity.
- `03-rag-cag-knowledge-layer`: knowledge and context.
- `04-skills-autoskills-registry`: reusable capabilities.
- `05-documentation-agent`: active documentation.
- `06-kdd-data-pipelines`: KDD pipelines.
- `07-agentic-workflows`: execution workflows.
- `08-experimentation-lab`: scientific validation.
- `09-observability-platform`: metrics, logs and traces.
- `10-infra-docker`: local development infrastructure.
- `11-infra-kubernetes`: scalable deployment.
- `12-ci-cd-security`: CI/CD and security.
- `13-ui-command-center`: UI components and design system.
- `14-paper-reproducibility-kit`: paper and reproducibility.
- `15-race-command-center`: final operational dashboard and global launcher.

## Paper Fit

The command center demonstrates the feasibility of AI in edge-like racing
engineering conditions with constraints in latency, energy, memory and
operational utility. It closes the loop:

```text
telemetry -> pattern -> hypothesis -> setup or part change -> validation -> evidence
```
