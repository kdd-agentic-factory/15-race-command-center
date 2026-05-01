# Agents Operating Guide

The Race Command Center coordinates specialized agents under a crew-chief
approval model.

## Agent Roles

- `track_model_agent`: loads circuit profiles, weather and historical sessions.
- `pattern_discovery_agent`: retrieves similar sessions and mines telemetry patterns.
- `crew_chief_agent`: proposes setup baselines and setup changes.
- `parts_design_agent`: recommends circuit-specific parts and constraints.
- `approval_agent`: enforces human-in-the-loop decisions.
- `documentation_agent`: generates run plans, reports and paper evidence.

## Approval Principle

Any recommendation that changes setup, tire strategy, electronics or physical
parts must produce an auditable `crew_chief_decision` and pass an approval gate.

