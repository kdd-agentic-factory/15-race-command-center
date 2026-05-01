from .ekf_state import EKFState


def update_with_gps(state: EKFState, gps_x: float, gps_y: float, gain: float = 0.35) -> EKFState:
    x = list(state.x)
    if len(x) >= 2:
        x[0] = x[0] + gain * (gps_x - x[0])
        x[1] = x[1] + gain * (gps_y - x[1])
    return EKFState(x=x, covariance=state.covariance, ts_micro=state.ts_micro)


def update_lean_angle(state: EKFState, imu_roll_deg: float, gain: float = 0.5) -> EKFState:
    x = list(state.x)
    while len(x) <= 4:
        x.append(0.0)
    x[4] = x[4] + gain * (imu_roll_deg - x[4])
    return EKFState(x=x, covariance=state.covariance, ts_micro=state.ts_micro)

