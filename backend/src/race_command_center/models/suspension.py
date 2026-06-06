"""Structured suspension model for the Setup Impact Estimator (Spec §8.2, crew-chief notes).

Captures the front/rear suspension split the way the engineers enter it on the
setup sheet, with explicit click ranges so the panel can translate manual clicks
to a real, comparable hardness scale:

* **Preload** — turns/rings, base 0, in 0.25 steps (0, 0.25, 0.5, 0.75, 1.0 …).
* **Compression / Rebound** — integer clicks, ``1`` = fully closed = hardest,
  ``max_clicks`` = fully open = softest. The range is per fork/shock.
* **Spring rate** — N/mm, entered manually.
* **Air gap / oil level** — mm (front).
* **Rear** additionally exposes **high/low-speed compression** (multi-adjustable
  shocks).
"""

from __future__ import annotations

from pydantic import BaseModel, Field, field_validator


class ClickParam(BaseModel):
    """An integer click adjuster where 1 = closed (hardest) … max = open (softest)."""

    clicks: int = Field(..., ge=1, description="Current click, 1 = hardest (closed)")
    max_clicks: int = Field(..., ge=1, description="Total clicks for this fork/shock")

    @field_validator("max_clicks")
    @classmethod
    def _max_ge_clicks(cls, v: int, info):
        clicks = info.data.get("clicks")
        if clicks is not None and v < clicks:
            raise ValueError("max_clicks must be >= clicks")
        return v

    @property
    def hardness(self) -> float:
        """Normalised hardness in [0,1]: click 1 → 1.0 (hardest), max → 0.0."""
        if self.max_clicks <= 1:
            return 1.0
        return round((self.max_clicks - self.clicks) / (self.max_clicks - 1), 4)


class PreloadParam(BaseModel):
    """Preload in turns/rings, base 0, quantised to 0.25 steps."""

    turns: float = Field(0.0, ge=0.0)
    max_turns: float = Field(5.0, gt=0.0)

    @field_validator("turns")
    @classmethod
    def _quarter_steps(cls, v: float) -> float:
        if round(v / 0.25) * 0.25 != v:
            raise ValueError("preload turns must be in 0.25 steps")
        return v


class ForkSettings(BaseModel):
    preload: PreloadParam = Field(default_factory=PreloadParam)
    compression: ClickParam
    rebound: ClickParam
    spring_rate_nmm: float | None = Field(None, description="Fork spring rate, N/mm")
    oil_level_mm: float | None = Field(None, description="Oil level / air gap, mm")


class ShockSettings(BaseModel):
    preload: PreloadParam = Field(default_factory=PreloadParam)
    # Either a single compression adjuster, or split high/low speed.
    compression: ClickParam | None = None
    high_speed_compression: ClickParam | None = None
    low_speed_compression: ClickParam | None = None
    rebound: ClickParam
    spring_rate_nmm: float | None = None
    length_mm: float | None = None


class SuspensionSetup(BaseModel):
    setup_id: str
    name: str = ""
    fork: ForkSettings
    shock: ShockSettings
