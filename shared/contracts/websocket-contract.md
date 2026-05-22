# Race Command Center — WebSocket Contract

## Endpoint

```
ws://localhost:8150/ws/telemetry
```

## Message Format (Server → Client)

Every 100ms (10 Hz):

```json
{
  "ts": 1716470400.123,
  "phase": "drive",
  "speed": 213.4,
  "tps": 87.2,
  "brake_press_front": 0.2,
  "imu_roll": 45.1,
  "tire_temp_carcass": 114.3,
  "spin_ratio": 0.0631,
  "physics_loss": 0.0182,
  "imu_drift": 0.412,
  "rpm": 13200
}
```

## Fields

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| `ts` | float | s (epoch) | Timestamp |
| `phase` | string | — | Corner phase: braking / apex / drive |
| `speed` | float | km/h | Vehicle speed |
| `tps` | float | % | Throttle position |
| `brake_press_front` | float | bar | Front brake pressure |
| `imu_roll` | float | deg | Lean angle |
| `tire_temp_carcass` | float | °C | Rear tire carcass temperature |
| `spin_ratio` | float | — | Rear wheel spin ratio |
| `physics_loss` | float | — | RNN-PINN physics loss |
| `imu_drift` | float | — | UKF-M IMU drift |
| `rpm` | float | rpm | Engine RPM |
