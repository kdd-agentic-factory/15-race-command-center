---
tokens:
  colors:
    background: "#090d12"
    surface: "#111820"
    surfaceRaised: "#17212b"
    line: "#263443"
    text: "#e7edf2"
    muted: "#95a6b5"
    telemetryCyan: "#42d3e8"
    okGreen: "#49d17c"
    warningAmber: "#e8b64a"
    dangerRed: "#f05d5e"
    predictionViolet: "#a88cff"
  typography:
    sans: "Inter, Segoe UI, Arial, sans-serif"
    mono: "Consolas, JetBrains Mono, SFMono-Regular, monospace"
  spacing:
    unit: 4
    panelGap: 10
    pageInset: 16
  radii:
    panel: 8
    control: 8
---

# Race Command Center Design

## Purpose

`15-race-command-center` is the operating system for race engineering evidence.
It integrates high-frequency telemetry, KDD stages, agentic reasoning,
streaming infrastructure, knowledge retrieval and deployment targets.

## Architecture

```text
Bike / simulator telemetry
  -> Redpanda topics
  -> Flink streaming jobs
  -> KDD selection / preprocessing / transformation
  -> EKF and curve segmentation
  -> tire degradation and pattern mining
  -> RAG/CAG retrieval and agent reasoning
  -> crew-chief approval
  -> dashboard, reports and deployment evidence
```

## Operating Constraints

- Latency-sensitive telemetry paths should remain stream-first.
- Recommendations must include evidence and confidence.
- Physical setup and part-design actions require crew-chief approval.
- The system must produce reproducible paper evidence from demo sessions.

## Dashboard Style

The dashboard is an operational telemetry surface, not a marketing page.

- Use a dark terminal-like cockpit with dense but legible information.
- Use red only for safety or degradation risk.
- Use amber only for warning and approval-pending states.
- Use monospaced typography for telemetry, timestamps, logs and matrices.
- Keep panels flat, compact and aligned to a strict grid.
- Do not hide safety metrics behind menus.
- Do not use heavy shadows, decorative gradients or ornamental backgrounds.
- Keep first viewport focused on live telemetry, tire risk and engineering action.
