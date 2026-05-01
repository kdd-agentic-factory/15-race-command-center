# Telemetry Data Dictionary

The telemetry core moves the project from aggregated mobility events to
high-frequency physical telemetry.

| Field | Type | Unit | Description |
| --- | --- | --- | --- |
| `ts_micro` | integer | microseconds | High-precision timestamp. |
| `gps_lat` | float | degrees | RTK GPS latitude. |
| `gps_lon` | float | degrees | RTK GPS longitude. |
| `imu_yaw` | float | degrees | Yaw angle. |
| `imu_pitch` | float | degrees | Pitch angle. |
| `imu_roll` | float | degrees | Roll angle used for lean-angle estimation. |
| `tps` | float | percent | Throttle Position Sensor, 0 to 100. |
| `brake_press_front` | float | bar | Front brake pressure. |
| `brake_press_rear` | float | bar | Rear brake pressure. |
| `susp_travel_f` | float | mm | Front suspension travel. |
| `susp_travel_r` | float | mm | Rear suspension travel. |
| `tire_temp_surface` | float | celsius | Tire surface temperature. |
| `tire_temp_carcass` | float | celsius | Tire carcass temperature. |
| `wheel_speed_f` | float | km/h | Front wheel speed. |
| `wheel_speed_r` | float | km/h | Rear wheel speed. |

