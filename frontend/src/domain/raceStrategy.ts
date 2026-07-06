/**
 * raceStrategy.ts — KDD Race Strategy Command.
 *
 * The pit-wall decision surface: from telemetry to a defensible race call.
 * Sizes the race, models tyre degradation lap-by-lap, finds the pit /
 * flag-to-flag window, ranks strategy options, runs undercut/overcut
 * maths against a named rival, arms the weather trigger, lays out a
 * push/manage pace plan and the live "if X then Y" decision rules.
 *
 * Deterministic model derived from circuit length + turns. Honest: this is a
 * representative strategy model, not a live timing / weather radar feed.
 *
 * Adapted from 13-ui-command-center/src/domain/raceStrategy.ts for KDD tokens.
 */
import type { SessionMode } from "../types/race-session";

export type Risk = "low" | "medium" | "high";

export interface TyreCompound {
  name: string;
  position: "Front" | "Rear";
  degPerLap: number;
  cliffLap: number;
  window: string;
  note: string;
}

export interface DegPoint {
  lap: number;
  paceDelta: number;
}

export interface StrategyOption {
  id: string;
  name: string;
  stops: number;
  projectedDelta: number;
  risk: Risk;
  recommended: boolean;
  note: string;
}

export interface RivalMove {
  rival: string;
  gap: number;
  trend: "closing" | "stable" | "opening";
  move: "undercut" | "overcut" | "hold";
  gainPerLap: number;
  where: string;
  verdict: string;
}

export interface WeatherTrigger {
  condition: string;
  probability: number;
  action: string;
  byLap: number;
  armed: boolean;
}

export interface PhasePlan {
  phase: string;
  laps: string;
  target: string;
  mode: "push" | "manage" | "attack";
}

export interface DecisionTrigger {
  when: string;
  then: string;
  priority: Risk;
}

export interface RaceStrategy {
  combo: string;
  circuit: string;
  lengthKm: number;
  raceLaps: number;
  raceKm: number;
  verdict: string;
  punchline: string;
  recommendedStrategy: string;
  confidence: number;
  compounds: TyreCompound[];
  degCurve: DegPoint[];
  pitWindow: { openLap: number; closeLap: number; optimalLap: number; reason: string };
  options: StrategyOption[];
  rival: RivalMove;
  weather: WeatherTrigger;
  phasePlan: PhasePlan[];
  triggers: DecisionTrigger[];
  contingency: string[];
}

export function riskColor(r: Risk): string {
  if (r === "high") return "text-kdd-accent";
  if (r === "medium") return "text-kdd-yellow";
  return "text-kdd-green";
}

export function riskBadgeClass(r: Risk): string {
  if (r === "high") return "badge-danger";
  if (r === "medium") return "badge-warn";
  return "badge-ok";
}

/**
 * Single source of truth for how many racing laps a circuit length implies.
 * A race is ~120 km; derive laps from circuit length, clamped to 18–30.
 */
export function raceLapsFor(lengthKm: number): number {
  const laps = Math.round(120 / Math.max(lengthKm, 2.5));
  return Math.min(30, Math.max(18, laps));
}

/**
 * Mode-aware strategy builder. Returns the full strategy surface adapted
 * to the session mode (practice / qualifying / race / replay / simulation).
 */
export function buildRaceStrategy(
  rider: string,
  bike: string,
  circuit: string,
  lengthKm: number,
  turns: number,
  mode: SessionMode,
): RaceStrategy {
  const raceLaps = raceLapsFor(lengthKm);
  const raceKm = Math.round(raceLaps * lengthKm * 10) / 10;

  // Rear deg dominates exit + lap time; cliff a few laps before the flag.
  const degPerLap = Math.round((0.05 + turns * 0.0035) * 1000) / 1000;
  const cliffLap = raceLaps - 4;
  const degCurve: DegPoint[] = Array.from({ length: raceLaps }, (_, i) => {
    const lap = i + 1;
    const base = degPerLap * i;
    const cliff = lap > cliffLap ? (lap - cliffLap) * degPerLap * 1.8 : 0;
    return { lap, paceDelta: Math.round((base + cliff) * 100) / 100 };
  });

  const optimalLap = Math.round(raceLaps * 0.62);

  // Mode-specific strategy surface
  const modeStrategy = buildModeStrategy(mode, raceLaps, cliffLap, optimalLap, degPerLap, turns);

  return {
    combo: `${rider} · ${bike} · ${circuit}`,
    circuit,
    lengthKm,
    raceLaps,
    raceKm,
    verdict: modeStrategy.verdict,
    punchline: modeStrategy.punchline,
    recommendedStrategy: modeStrategy.recommendedStrategy,
    confidence: modeStrategy.confidence,
    compounds: [
      { name: "Soft", position: "Front", degPerLap: degPerLap * 0.6, cliffLap: raceLaps - 2, window: `Full race`, note: "Best front feel into braking; holds to the flag here." },
      { name: "Medium", position: "Rear", degPerLap, cliffLap, window: `to lap ${cliffLap}`, note: "Balanced — recommended. Edge grip fades after the cliff." },
      { name: "Soft", position: "Rear", degPerLap: degPerLap * 1.35, cliffLap: cliffLap - 4, window: `to lap ${cliffLap - 4}`, note: "Early pace, big drop — only if you can break the tow early." },
      { name: "Hard", position: "Rear", degPerLap: degPerLap * 0.7, cliffLap: raceLaps, window: "Full race", note: "Survives but slow to switch on; risky if track temp drops." },
    ],
    degCurve,
    pitWindow: {
      openLap: optimalLap - 3,
      closeLap: optimalLap + 3,
      optimalLap,
      reason: `Dry race → no stop. Window shown is the flag-to-flag swap window if rain arrives; lap ${optimalLap} balances track position vs a wet track filling up.`,
    },
    options: modeStrategy.options,
    rival: {
      rival: "Bagnaia (Ducati)",
      gap: 0.9,
      trend: "closing",
      move: "overcut",
      gainPerLap: 0.12,
      where: `T${Math.max(2, Math.round(turns * 0.45))} entry → his rear lights up 2 laps before yours`,
      verdict: `Don't fight lap 1. Hold the tow, let his soft rear cook, attack from lap ${Math.round(raceLaps * 0.7)}. Overcut beats undercut by ~0.4s here.`,
    },
    weather: {
      condition: "Rain front from sector 3",
      probability: 0.35,
      action: "Switch to flag-to-flag — call the wet bike to pit lane",
      byLap: optimalLap,
      armed: true,
    },
    phasePlan: modeStrategy.phasePlan,
    triggers: [
      { when: `Rear drop > ${(degPerLap * 1.5).toFixed(2)} s/lap before lap ${cliffLap}`, then: "Switch to manage mode now, defend track position", priority: "high" },
      { when: `Rain probability crosses 50% before lap ${optimalLap}`, then: "Arm flag-to-flag, ready wet bike, watch sector 3", priority: "high" },
      { when: "Rival gap < 0.4s into final third", then: "Cover the inside at the heavy-braking zone, hold the line", priority: "medium" },
      { when: "Front temp below window after a safety-car", then: "One warm-up lap of weave + brake before re-attacking", priority: "medium" },
    ],
    contingency: modeStrategy.contingency,
  };
}

interface ModeStrategy {
  verdict: string;
  punchline: string;
  recommendedStrategy: string;
  confidence: number;
  options: StrategyOption[];
  phasePlan: PhasePlan[];
  contingency: string[];
}

function buildModeStrategy(
  mode: SessionMode,
  raceLaps: number,
  cliffLap: number,
  optimalLap: number,
  degPerLap: number,
  turns: number,
): ModeStrategy {
  switch (mode) {
    case "race":
      return {
        verdict: `Soft front / medium rear, manage rear edge from lap ${Math.round(raceLaps * 0.55)} — the rear cliff, not the front, decides this race.`,
        punchline: "Win it on tyre life, not on lap 1.",
        recommendedStrategy: "0-stop slick · rear-life managed · flag-to-flag armed",
        confidence: 0.88,
        options: [
          { id: "zero", name: "0-stop slick (manage rear)", stops: 0, projectedDelta: 0, risk: "medium", recommended: true, note: "Fastest if you protect the rear past the cliff. Baseline." },
          { id: "soft-attack", name: "Soft rear early attack", stops: 0, projectedDelta: 2.4, risk: "high", recommended: false, note: "Build a gap in the first third, hang on. Loses if the cliff hits before the gap is safe." },
          { id: "hard-defensive", name: "Hard rear defensive", stops: 0, projectedDelta: 3.1, risk: "low", recommended: false, note: "Safe to the flag, no late drama — but concedes the first laps." },
          { id: "ftf", name: "Flag-to-flag (bike swap)", stops: 1, projectedDelta: 18.0, risk: "high", recommended: false, note: "Only on a rain trigger — armed below, not active." },
        ],
        phasePlan: [
          { phase: "Launch", laps: "1–2", target: "Track position, no hero moves", mode: "attack" },
          { phase: "Build", laps: `3–${Math.round(raceLaps * 0.45)}`, target: "Hold reference pace · protect front", mode: "push" },
          { phase: "Manage", laps: `${Math.round(raceLaps * 0.45) + 1}–${cliffLap}`, target: "Save rear edge · short-shift on exit", mode: "manage" },
          { phase: "Sprint", laps: `${cliffLap + 1}–${raceLaps}`, target: "Past the cliff — spend what is left", mode: "attack" },
        ],
        contingency: [
          "Safety car: pit only if it coincides with the rain trigger — otherwise track position wins.",
          "Long lap penalty: take it before the cliff, never after — deg makes recovery impossible late.",
          "Rear cliff arrives early: drop to defensive lines, concede ~0.3s/lap, hold P-position to the flag.",
        ],
      };

    case "qualifying":
      return {
        verdict: "Time attack mode — peak pace, tyre warmup on out-lap, sector-by-sector optimization.",
        punchline: "Every sector is a qualifying session. No margin for error.",
        recommendedStrategy: "Soft compounds · aggressive out-lap · sector-attack plan",
        confidence: 0.85,
        options: [
          { id: "full-attack", name: "Full attack — soft both", stops: 0, projectedDelta: 0, risk: "high", recommended: true, note: "Maximum pace on both axles. Tyre window is tight — hit it on the out-lap." },
          { id: "safe-lap", name: "Safe banker lap", stops: 0, projectedDelta: 1.2, risk: "low", recommended: false, note: "Bank a solid lap first, then push. Risk: you may not get a second chance." },
          { id: "two-push", name: "Two-push strategy", stops: 0, projectedDelta: 0.8, risk: "medium", recommended: false, note: "Push first sector, manage mid, push final sector. Sector optimization." },
        ],
        phasePlan: [
          { phase: "Out-lap", laps: "1", target: "Tyre warmup, brake temp, find the window", mode: "attack" },
          { phase: "Push", laps: "2–3", target: "Peak pace, sector optimization", mode: "attack" },
          { phase: "Recovery", laps: "4", target: "Cool down, review data, prepare Q2", mode: "manage" },
        ],
        contingency: [
          "Red flag: instant out-lap on restart. Tyre temp drops fast — re-warm aggressively.",
          "Traffic: abort and start another out-lap. Don't waste the push on dirty air.",
          "Rain: pit immediately. Wets in qualifying are unpredictable — preserve the dry setup.",
        ],
      };

    case "practice":
      return {
        verdict: "Setup learning mode — consistency, corner confidence, data collection.",
        punchline: "Lap times don't matter. Learning does.",
        recommendedStrategy: "Medium compounds · consistent laps · setup sweep",
        confidence: 0.9,
        options: [
          { id: "setup-sweep", name: "Setup sweep", stops: 0, projectedDelta: 0, risk: "low", recommended: true, note: "Run planned setup changes each stint. Focus on rear balance and brake feel." },
          { id: "consistency", name: "Consistency run", stops: 0, projectedDelta: 0.5, risk: "low", recommended: false, note: "10+ laps at reference pace. Validate tyre thermal stability and rider comfort." },
          { id: "race-pace", name: "Race pace simulation", stops: 0, projectedDelta: 1.0, risk: "medium", recommended: false, note: "Full race distance simulation. Validate strategy and pit window assumptions." },
        ],
        phasePlan: [
          { phase: "Shakedown", laps: "1–3", target: "Verify systems, initial feel", mode: "push" },
          { phase: "Setup A", laps: "4–8", target: "Baseline setup validation", mode: "manage" },
          { phase: "Setup B", laps: "9–14", target: "Compare changes, collect evidence", mode: "push" },
          { phase: "Long run", laps: "15–20", target: "Race pace validation, tyre deg", mode: "manage" },
        ],
        contingency: [
          "Rain: switch to wet setup validation. Don't waste dry track time on dry setup.",
          "Mechanical issue: abort and record. Don't push through — preserve the bike.",
          "Rider feedback conflict: trust rider feel over data. Setup follows the rider.",
        ],
      };

    case "replay":
      return {
        verdict: "Replay debrief — reconstruct evidence, compare laps, audit decisions.",
        punchline: "What happened, why, and what we'd do differently.",
        recommendedStrategy: "Lap comparison · decision audit · evidence reconstruction",
        confidence: 0.92,
        options: [
          { id: "full-replay", name: "Full session replay", stops: 0, projectedDelta: 0, risk: "low", recommended: true, note: "Complete session analysis with lap-by-lap comparison and decision audit." },
          { id: "incident-focus", name: "Incident-focused replay", stops: 0, projectedDelta: 0, risk: "low", recommended: false, note: "Zoom into specific incidents. Deep dive into telemetry around key moments." },
          { id: "rival-compare", name: "Rival comparison", stops: 0, projectedDelta: 0, risk: "low", recommended: false, note: "Overlay rival telemetry. Identify where time was gained or lost." },
        ],
        phasePlan: [
          { phase: "Overview", laps: "All", target: "Session summary, key moments", mode: "manage" },
          { phase: "Deep Dive", laps: "Selected", target: "Telemetry analysis, evidence", mode: "push" },
          { phase: "Verdict", laps: "—", target: "Decision audit, lessons learned", mode: "manage" },
        ],
        contingency: [
          "Missing data: flag gaps in telemetry. Don't speculate — note what's unknown.",
          "Conflicting evidence: present both sides. Let the crew chief decide.",
          "No issues found: that's valid too. Document the baseline for future reference.",
        ],
      };

    case "simulation":
      return {
        verdict: "Predicted strategy — what-if scenarios with synthetic telemetry and confidence bounds.",
        punchline: "Simulated outcomes, honest uncertainty.",
        recommendedStrategy: "Scenario analysis · confidence bounds · risk assessment",
        confidence: 0.72,
        options: [
          { id: "baseline-sim", name: "Baseline scenario", stops: 0, projectedDelta: 0, risk: "medium", recommended: true, note: "Standard conditions, predicted outcome. Confidence: moderate." },
          { id: "aggressive-sim", name: "Aggressive scenario", stops: 0, projectedDelta: -1.8, risk: "high", recommended: false, note: "Push harder early. Predicted gain, but cliff risk increases significantly." },
          { id: "defensive-sim", name: "Defensive scenario", stops: 0, projectedDelta: 2.5, risk: "low", recommended: false, note: "Conservative approach. Predicted loss but higher completion confidence." },
        ],
        phasePlan: [
          { phase: "Setup", laps: "—", target: "Initialize simulation parameters", mode: "manage" },
          { phase: "Run", laps: "1–20", target: "Execute scenario with synthetic telemetry", mode: "push" },
          { phase: "Analyze", laps: "—", target: "Review outcomes and confidence bounds", mode: "manage" },
        ],
        contingency: [
          "Low confidence: results are indicative only. Do not use for pit-wall decisions.",
          "Model drift: if simulation diverges from reality, recalibrate and re-run.",
          "Multiple scenarios: compare all, pick the one with best risk-adjusted outcome.",
        ],
      };
  }
}
