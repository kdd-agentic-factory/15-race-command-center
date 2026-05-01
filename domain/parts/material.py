from dataclasses import dataclass


@dataclass(frozen=True)
class Material:
    code: str
    density_g_cm3: float
    max_temp_c: float
    additive_manufacturing: bool

