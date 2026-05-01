# Paper Claims to Demonstration Matrix

Reference paper:

- Title: Structural optimization principles for edge AI in motorsport telemetry.
- DOI: `10.1038/s41598-026-49736-0`.
- Published: 2026-05-01.

## What the Paper Claims

The paper is methodological. It does not introduce a new quantization algorithm;
it proposes a reproducible engineering framework for deciding when low-precision
LLM deployment is feasible under motorsport-like resource constraints.

Core claims to demonstrate:

| ID | Paper claim | Demonstration in this organization | Status |
| --- | --- | --- | --- |
| C01 | Structural lightweighting and PTQ can be analyzed through sensitivity-aware optimization. | Map topology-optimization reasoning to `apps/parts-design-studio`, `domain/parts` and PTQ evidence in the PoC. | Ready as conceptual + executable evidence. |
| C02 | Edge/trackside AI is constrained by memory, bandwidth, latency and power. | Run `scripts/run-paper-poc.py` to produce memory, throughput, power, latency and IPW evidence. | Ready as synthetic PoC; needs hardware benchmark for final paper table. |
| C03 | GPTQ/AWQ-style sensitivity-aware quantization can reduce computational footprint while preserving operational usefulness. | Demonstrate FP16 vs INT8 vs INT4 operating points and route the accepted profile into the crew-chief workflow. | Ready as PoC; real GPTQ/AWQ integration remains a next implementation step. |
| C04 | Digital Factor of Safety can gate low-precision deployment. | `FoS_dig = integrity_threshold / observed_perplexity_ratio` in the PoC, with approval gates. | Ready. |
| C05 | Intelligence-per-Watt captures energy-aware inference efficiency. | `IPW = useful_tokens_per_second / watts`, exported as paper evidence. | Ready. |
| C06 | Motorsport telemetry is a valid operational setting for edge AI evaluation. | Use high-frequency telemetry contracts, EKF, curve segmentation, tire degradation and crew-chief decisions in `15-race-command-center`. | Ready as race-engineering demonstrator. |
| C07 | Evidence is bounded by the structural and computational case studies considered. | The docs separate demonstrated PoC evidence from future real hardware and physical validation. | Ready. |

## Repository Coverage

| Repository | How it supports the paper demonstration |
| --- | --- |
| `00-kdd-governance` | Defines policies, approval, reproducibility and evidence rules. |
| `01-agent-orchestrator` | Coordinates analysis agents and crew-chief approval workflows. |
| `02-mcp-gateway` | Exposes tools for files, Docker, Kubernetes, vector search and observability. |
| `03-rag-cag-knowledge-layer` | Retrieves paper context, historical sessions and engineering evidence. |
| `04-skills-autoskills-registry` | Stores reusable analysis and validation capabilities. |
| `05-documentation-agent` | Generates paper-ready reports, SDD and as-built evidence. |
| `06-kdd-data-pipelines` | Implements selection, preprocessing, transformation, mining, interpretation and deployment. |
| `07-agentic-workflows` | Provides reusable workflows for experiments, deployment and paper sections. |
| `08-experimentation-lab` | Holds experiments for runtime, traceability and reproducibility. |
| `09-observability-platform` | Captures metrics, logs and traces for latency, power proxies and system reliability. |
| `10-infra-docker` | Launches the local infrastructure stack. |
| `11-infra-kubernetes` | Supports scalable deployment scenarios. |
| `12-ci-cd-security` | Provides CI/CD and security controls for reproducible artefacts. |
| `13-ui-command-center` | Supplies the UI design system and shared command-center components. |
| `14-paper-reproducibility-kit` | Stores the manuscript, experiment protocol, metrics and final results. |
| `15-race-command-center` | Runs the final MotoGP engineering demonstrator and global launcher. |

## Decision

Yes, the organization can demonstrate the paper's central thesis, provided the
claim is framed correctly:

- Demonstrable now: architecture, reproducible PoC, operating metrics, workflow,
  telemetry contracts and engineering decision loop.
- Requires real-world completion before claiming production-grade MotoGP use:
  physical telemetry adapters, real track datasets, hardware power measurement,
  validated PTQ benchmark runs, and real crew-chief acceptance testing.

