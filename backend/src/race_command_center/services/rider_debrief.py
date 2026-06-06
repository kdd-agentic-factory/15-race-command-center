"""Rider voice debrief — semantic NLP interpreter (Spec §12).

When the rider gets off the bike, their spoken impressions (transcribed to text
by an external speech-to-text service) are interpreted here and turned into
**segmented recommendations per staff role** (suspension / electronics /
chassis). Stored debriefs form the tribal-knowledge repository for the next GP.

The interpreter is rule/keyword based (Spanish + English) so it is deterministic
and testable; it can later be backed by the OpenRouter LLM for free-form nuance.
"""

from __future__ import annotations

import re
from typing import Any

# issue → (spanish/english keywords)
_ISSUES = {
    "understeer": ["subviraje", "understeer", "se va de delante", "empuja"],
    "oversteer": ["sobreviraje", "oversteer", "se va de detras", "se va de detrás"],
    "chatter": ["chatter", "rebote", "vibracion", "vibración", "vibra"],
    "spin": ["patina", "spin", "desliza", "falta agarre", "falta de agarre", "sin agarre"],
    "instability": ["inestable", "inestabilidad", "weave", "wobble", "movimiento", "baile"],
    "lockup": ["bloquea", "bloqueo", "lockup", "se bloquea"],
    "pumping": ["pumping", "se hunde", "fondo", "bottoming"],
}

# corner phase → keywords
_PHASES = {
    "braking": ["frenada", "frenar", "freno", "braking", "soltar el freno", "soltando el freno"],
    "entry": ["entrada", "entry", "meter la moto", "tumbar"],
    "mid": ["paso por curva", "apex", "vertice", "vértice", "medio de la curva", "mid"],
    "exit": ["salida", "exit", "acelerar", "aceleracion", "aceleración", "abrir gas", "abriendo gas"],
}

_SEVERITY = {
    "severe": ["severo", "severa", "mucho", "grave", "muchisimo", "muchísimo", "enorme", "fuerte"],
    "mild": ["leve", "poco", "ligero", "ligera", "un poco", "pequeño", "pequeno"],
}


def _find(text: str, table: dict[str, list[str]]) -> list[str]:
    low = text.lower()
    return [k for k, kws in table.items() if any(kw in low for kw in kws)]


def interpret(transcript: str) -> dict[str, Any]:
    """Extract handling issues, corner phase(s), severity and corner numbers."""
    issues = _find(transcript, _ISSUES)
    phases = _find(transcript, _PHASES)
    sev = _find(transcript, _SEVERITY)
    severity = "severe" if "severe" in sev else "mild" if "mild" in sev else "moderate"
    corners = [int(n) for n in re.findall(r"(?:curva|turn|t)\s*(\d{1,2})", transcript.lower())]
    return {
        "issues": issues,
        "phases": phases,
        "severity": severity,
        "corners": corners,
        "transcript": transcript,
    }


# (issue, phase) → per-staff recommendations
_RECO: dict[str, dict[str, list[str]]] = {
    "understeer": {
        "suspension": ["Open front compression 1–2 clicks (softer) to load the front", "Reduce front preload 0.25 turn"],
        "electronics": ["Soften engine brake one level on corner entry"],
        "chassis": ["Lower front ride height / move weight forward for more front grip"],
    },
    "oversteer": {
        "suspension": ["Stiffen rear (close compression 1 click) and add rear preload 0.25 turn"],
        "electronics": ["Increase traction control one level; soften power map on exit"],
        "chassis": ["Add anti-squat / lengthen swingarm pivot for exit stability"],
    },
    "chatter": {
        "suspension": ["Review fork/shock spring + compression to damp the 17–22 Hz resonance"],
        "electronics": [],
        "chassis": ["Adjust ride height to shift the chassis natural frequency"],
    },
    "spin": {
        "suspension": ["Soften rear for more mechanical grip on exit"],
        "electronics": ["Raise traction control; smoother power delivery map"],
        "chassis": ["More anti-squat to keep the rear planted"],
    },
    "instability": {
        "suspension": ["Add rear rebound; check steering damper setting"],
        "electronics": ["Smoother power map to reduce weave excitation"],
        "chassis": ["Review geometry / wheelbase for high-speed stability"],
    },
    "lockup": {
        "suspension": ["Soften front compression to manage load transfer under braking"],
        "electronics": ["Increase engine-brake assist to reduce rear lockup"],
        "chassis": [],
    },
    "pumping": {
        "suspension": ["Raise compression (high-speed) and check air gap/oil level"],
        "electronics": [],
        "chassis": ["Check ride height to avoid bottoming"],
    },
}


def recommendations(interpretation: dict[str, Any]) -> dict[str, list[str]]:
    """Segment recommendations per staff role from the interpreted issues."""
    out: dict[str, list[str]] = {"suspension": [], "electronics": [], "chassis": []}
    for issue in interpretation.get("issues", []):
        block = _RECO.get(issue, {})
        for role in out:
            out[role].extend(block.get(role, []))
    # de-dup preserving order
    for role in out:
        seen: set[str] = set()
        out[role] = [r for r in out[role] if not (r in seen or seen.add(r))]
    return out


def debrief(transcript: str) -> dict[str, Any]:
    """Full pipeline: interpret a transcript → staff-segmented recommendations."""
    interp = interpret(transcript)
    return {
        "interpretation": interp,
        "recommendations": recommendations(interp),
        "summary": _summary(interp),
    }


def _summary(interp: dict[str, Any]) -> str:
    if not interp["issues"]:
        return "No specific handling issue detected; logged for the knowledge base."
    issues = ", ".join(interp["issues"])
    where = f" in {'/'.join(interp['phases'])}" if interp["phases"] else ""
    corners = f" (corner {', '.join(map(str, interp['corners']))})" if interp["corners"] else ""
    return f"{interp['severity']} {issues}{where}{corners}."
