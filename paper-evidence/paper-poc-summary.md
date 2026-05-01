# Paper PoC Summary

Paper: Structural optimization principles for edge AI in motorsport telemetry
DOI: 10.1038/s41598-026-49736-0
Accepted operating point: `int4_32b_trackside`

## Edge AI Operating Points

| Profile | Memory GB | Tok/s | Power W | Digital FoS | IPW | Accepted |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| fp16_32b_baseline | 61.0 | 26.0 | 295.0 | 1.1 | 0.0881 | False |
| int8_32b_balanced | 34.0 | 44.2 | 218.0 | 1.063 | 0.2028 | False |
| int4_32b_trackside | 18.0 | 69.9 | 165.0 | 1.026 | 0.4236 | True |

## MotoGP Telemetry Demo

- Circuit: `jerez`
- Corner: `T05`
- Lap: `14`
- Rear tire status: `warning`
- Estimated collapse lap: `18`
- Confidence: `0.82`
- Recommendations: switch_to_engine_map_2, increase_rear_rebound_by_2_clicks, reduce_torque_delivery_in_corners_T05_T08_T13

## Readiness

- Demonstrable now: yes.
- Production MotoGP tool ready: not yet; real telemetry, hardware and validation integrations remain.
