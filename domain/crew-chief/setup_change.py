from dataclasses import dataclass
from enum import Enum


class SetupChangeCategory(str, Enum):
    CHASSIS = "chassis"
    SUSPENSION = "suspension"
    BRAKING = "braking"
    ELECTRONICS = "electronics"
    TIRES = "tires"
    AERO_PARTS = "aero_parts"


SETUP_CHANGE_TAXONOMY: dict[str, list[str]] = {
    "chassis": [
        "front_ride_height",
        "rear_ride_height",
        "wheelbase",
        "swingarm_length",
        "steering_angle",
        "trail",
        "center_of_gravity_adjustment",
    ],
    "suspension": [
        "front_preload",
        "rear_preload",
        "front_compression",
        "rear_compression",
        "front_rebound",
        "rear_rebound",
        "spring_rate_front",
        "spring_rate_rear",
    ],
    "braking": ["brake_balance", "engine_brake_level", "front_brake_pressure_curve"],
    "electronics": [
        "traction_control_map",
        "anti_wheelie_map",
        "launch_control",
        "torque_delivery_map",
        "throttle_response_map",
    ],
    "tires": ["front_compound", "rear_compound", "front_pressure", "rear_pressure"],
    "aero_parts": [
        "front_winglet_profile",
        "sidepod_flow_deflector",
        "brake_cooling_duct",
        "rear_downforce_element",
    ],
}


@dataclass(frozen=True)
class SetupChange:
    category: SetupChangeCategory
    parameter: str
    old_value: str | float | int
    new_value: str | float | int
    reason: str

    def validate_taxonomy(self) -> bool:
        return self.parameter in SETUP_CHANGE_TAXONOMY[self.category.value]

