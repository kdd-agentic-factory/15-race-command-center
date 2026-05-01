# System Overview

The Race Command Center is an Edge-to-Lakehouse race engineering surface. It
combines streaming telemetry, KDD pipelines, agentic decision support, knowledge
retrieval and operational dashboards.

The core operating loop is:

1. Ingest high-frequency telemetry.
2. Estimate state using EKF sensor fusion.
3. Segment each corner into braking, apex and drive phases.
4. Predict tire degradation and detect anomalies.
5. Discover patterns across sessions.
6. Recommend setup or part changes.
7. Route actions through crew-chief approval.
8. Export evidence for the paper.

