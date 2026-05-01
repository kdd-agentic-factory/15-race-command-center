from .ekf_state import EKFState


def predict(state: EKFState, dt_s: float, process_noise: float = 0.01) -> EKFState:
    """Constant-velocity prediction for [x, y, vx, vy, roll]."""
    x = list(state.x)
    if len(x) >= 4:
        x[0] += x[2] * dt_s
        x[1] += x[3] * dt_s

    covariance = [
        [value + (process_noise if row == col else 0.0) for col, value in enumerate(values)]
        for row, values in enumerate(state.covariance)
    ]
    return EKFState(x=x, covariance=covariance, ts_micro=state.ts_micro + int(dt_s * 1_000_000))

