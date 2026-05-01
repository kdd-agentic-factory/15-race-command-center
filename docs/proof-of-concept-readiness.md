# Proof of Concept Readiness

## Current Verdict

The repositories can support a credible proof of concept for the paper and a
first MotoGP engineering command-center demonstrator.

The PoC is ready for:

- Launching the full organization from `15-race-command-center`.
- Demonstrating the paper's edge-AI operating-point logic.
- Showing high-frequency telemetry contracts.
- Running simplified EKF, curve segmentation, tire degradation and pattern-mining modules.
- Producing evidence files for the paper.
- Presenting a crew-chief approval loop.
- Presenting circuit-specific parts as the physical engineering closure.

The PoC is not yet ready to be described as a production MotoGP system because
the following still need real integrations:

- Live motorcycle CAN/ECU/IMU/GPS ingestion.
- Validated track datasets.
- Hardware power measurements on target edge devices.
- Real GPTQ/AWQ benchmark execution against selected LLMs.
- CFD/FEA validation for proposed circuit-specific parts.
- Human crew-chief acceptance tests.

## Minimum Demonstration Command

```powershell
python scripts\run-paper-poc.py
```

Expected outputs:

- `paper-evidence/paper-poc-evidence.json`
- `paper-evidence/paper-poc-summary.md`

## Full System Demonstration

```powershell
.\scripts\start-all.ps1
python scripts\run-paper-poc.py
```

This launches the repository organization and generates paper-facing evidence
from the race command center.

