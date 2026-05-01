# Repository Map

The definitive organization is operated from `15-race-command-center`.

| Repo | Role | Runtime surface |
| --- | --- | --- |
| `00-kdd-governance` | Governance and policies | `governance-repo` |
| `01-agent-orchestrator` | Multi-agent orchestrator | `agent-orchestrator-repo` |
| `02-mcp-gateway` | Tool connectivity | `mcp-gateway-repo` |
| `03-rag-cag-knowledge-layer` | Knowledge and context | `knowledge-layer-repo` |
| `04-skills-autoskills-registry` | Reusable capabilities | `skills-registry-repo` |
| `05-documentation-agent` | Active documentation | `documentation-agent-repo` |
| `06-kdd-data-pipelines` | KDD pipelines | `kdd-data-pipelines-repo` |
| `07-agentic-workflows` | Execution workflows | `agentic-workflows-repo` |
| `08-experimentation-lab` | Scientific validation | `experimentation-lab-repo` |
| `09-observability-platform` | Metrics, logs and traces | `observability-platform-repo` |
| `10-infra-docker` | Local development infrastructure | Base compose stack |
| `11-infra-kubernetes` | Scalable deployment | `infra-kubernetes-repo` and `make deploy-k8s` |
| `12-ci-cd-security` | CI/CD and security | `ci-cd-security-repo` |
| `13-ui-command-center` | UI components and design system | `ui-command-center-repo` |
| `14-paper-reproducibility-kit` | Paper and reproducibility | `paper-reproducibility-kit-repo` |
| `15-race-command-center` | Final operational dashboard and global launcher | `race-command-center` |

`make start` composes the infrastructure from `10-infra-docker` with the
repository surfaces and race dashboard from this repository.

