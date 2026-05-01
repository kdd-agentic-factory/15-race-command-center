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

