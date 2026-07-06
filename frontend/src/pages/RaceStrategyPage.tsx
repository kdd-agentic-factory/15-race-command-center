/**
 * RaceStrategyPage — KDD Race Strategy Command.
 *
 * The pit-wall decision surface: race sizing, tyre-degradation curve,
 * pit / flag-to-flag window, ranked strategy options, undercut/overcut maths
 * vs a named rival, the armed weather trigger, a push/manage pace plan and the
 * live decision rules — ending in one defensible call.
 *
 * Adapted from 13-ui-command-center/src/pages/RaceStrategyPage.tsx
 * CSS classes replaced with Tailwind kdd-* utilities. Consumes RaceSessionContext.
 */
import { Flag, CircleDot, CloudRain, Swords, Timer, ListChecks, Gauge } from "lucide-react";
import { useRaceSession } from "../hooks/useRaceSession";
import {
  sessionBadgeLabel,
  getDegradationMessages,
  SESSION_BADGE_CLASSES,
} from "../lib/session-badge";
import { DEGRADATION_MESSAGES } from "../lib/session-degradation";
import {
  buildRaceStrategy,
  riskBadgeClass,
  type StrategyOption,
  type PhasePlan,
} from "../domain/raceStrategy";

const CIRCUIT_LENGTH_KM: Record<string, number> = {
  mugello: 5.245,
  jarama: 3.313,
  jerez: 4.423,
  montmelo: 4.655,
  motorland: 5.344,
  "cheste-valencia": 4.005,
};

const CIRCUIT_TURNS: Record<string, number> = {
  mugello: 15,
  jarama: 13,
  jerez: 13,
  montmelo: 14,
  motorland: 17,
  "cheste-valencia": 14,
};

function modeLabel(mode: string): string {
  const labels: Record<string, string> = {
    practice: "Practice",
    qualifying: "Qualifying",
    race: "Race",
    replay: "Replay",
    simulation: "Simulation",
  };
  return labels[mode] ?? mode;
}

function modeAccent(mode: string): string {
  const accents: Record<string, string> = {
    practice: "border-t-kdd-cyan",
    qualifying: "border-t-kdd-purple",
    race: "border-t-kdd-accent",
    replay: "border-t-kdd-orange",
    simulation: "border-t-kdd-cyan",
  };
  return accents[mode] ?? "border-t-kdd-border";
}

function modeTextColor(mode: string): string {
  const colors: Record<string, string> = {
    practice: "text-kdd-cyan",
    qualifying: "text-kdd-purple",
    race: "text-kdd-accent",
    replay: "text-kdd-orange",
    simulation: "text-kdd-cyan",
  };
  return colors[mode] ?? "text-kdd-muted";
}

function phaseColor(phase: PhasePlan): string {
  if (phase.mode === "attack") return "bg-kdd-accent";
  if (phase.mode === "push") return "bg-kdd-cyan";
  return "bg-kdd-yellow";
}

export function RaceStrategyPage() {
  const { session, hasPersistedSession } = useRaceSession();

  const lengthKm = CIRCUIT_LENGTH_KM[session.circuitId] ?? 4.4;
  const turns = CIRCUIT_TURNS[session.circuitId] ?? 13;

  const s = buildRaceStrategy(
    session.riderName,
    session.bikeName,
    session.circuitName,
    lengthKm,
    turns,
    session.mode,
  );

  const maxDeg = Math.max(...s.degCurve.map((d) => d.paceDelta), 0.1);

  const badgeLabel = sessionBadgeLabel(session, hasPersistedSession);
  const degradationMessages = getDegradationMessages(
    session.telemetryStatus,
    session.circuitConfidence,
    session.dataSource,
  );

  const isMissingTelemetry = session.telemetryStatus === "missing";
  const isSimulation = session.dataSource === "simulation";

  return (
    <div className="bg-kdd-bg text-kdd-text space-y-6">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header>
        <div className="flex items-center gap-3">
          <p className="eyebrow">Race Strategy</p>
          <span className={SESSION_BADGE_CLASSES}>{badgeLabel}</span>
        </div>
        <h1 className="mt-2 text-3xl font-semibold flex items-center gap-2">
          <Flag size={18} className={modeTextColor(session.mode)} />
          Race Strategy Command
        </h1>
        <p className="mt-2 text-kdd-muted">
          {s.combo} · {session.mode.toUpperCase()} mode
        </p>
      </header>

      {degradationMessages.length > 0 && (
        <div className="space-y-2">
          {degradationMessages.map((msg) => (
            <div
              key={msg}
              className="rounded-kdd-md border border-kdd-yellow/40 bg-kdd-yellow-dim px-4 py-2 text-sm text-kdd-yellow"
            >
              {msg}
            </div>
          ))}
        </div>
      )}

      {isMissingTelemetry && (
        <div className="rounded-kdd-md border border-kdd-orange/40 bg-kdd-orange-dim px-4 py-3 text-sm text-kdd-orange">
          <strong>{DEGRADATION_MESSAGES.demoStrategy.split(".")[0]}.</strong> {DEGRADATION_MESSAGES.demoStrategy.split(". ").slice(1).join(". ")}
        </div>
      )}

      {isSimulation && (
        <div className="rounded-kdd-md border border-kdd-cyan/40 bg-kdd-cyan-dim px-4 py-3 text-sm text-kdd-cyan">
          <strong>{DEGRADATION_MESSAGES.predictedStrategy.split(".")[0]}.</strong> {DEGRADATION_MESSAGES.predictedStrategy.split(". ").slice(1).join(". ")}
        </div>
      )}

      {/* ── Mode indicator ─────────────────────────────────────────── */}
      <div className={`panel border-t-2 ${modeAccent(session.mode)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-kdd-mono text-[10px] font-bold uppercase tracking-[0.1em] text-kdd-dim">
              Strategy Mode
            </p>
            <p className={`mt-1 text-lg font-bold ${modeTextColor(session.mode)}`}>
              {modeLabel(session.mode)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-kdd-mono text-[10px] uppercase text-kdd-dim">Confidence</p>
            <p className={`mt-1 font-kdd-mono text-2xl font-bold ${s.confidence >= 0.8 ? "text-kdd-green" : "text-kdd-yellow"}`}>
              {Math.round(s.confidence * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* ── Verdict banner ─────────────────────────────────────────── */}
      <div className="panel">
        <p className="font-kdd-mono text-[10px] font-bold uppercase tracking-[0.1em] text-kdd-dim">
          KDD Verdict
        </p>
        <p className="mt-2 text-sm font-bold text-kdd-text">{s.verdict}</p>
        <p className="mt-1 text-xs text-kdd-accent italic">{s.punchline}</p>
      </div>

      {/* ── Race sizing ────────────────────────────────────────────── */}
      <div className="panel">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {[
            { label: "Race laps", value: s.raceLaps },
            { label: "Distance", value: `${s.raceKm} km` },
            { label: "Lap length", value: `${s.lengthKm} km` },
            { label: "Pit window", value: `L${s.pitWindow.openLap}–${s.pitWindow.closeLap}` },
            { label: "Optimal", value: `L${s.pitWindow.optimalLap}` },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="font-kdd-mono text-xl font-bold text-kdd-text">{item.value}</p>
              <p className="mt-0.5 font-kdd-mono text-[10px] uppercase text-kdd-dim">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tyre degradation curve ─────────────────────────────────── */}
      <div className="panel">
        <div className="mb-3 flex items-center gap-2">
          <Timer size={14} className="text-kdd-cyan" />
          <span className="font-kdd-mono text-[10px] font-bold uppercase tracking-[0.1em] text-kdd-dim">
            Rear tyre degradation · pace lost vs fresh (s/lap)
          </span>
        </div>
        <div className="flex items-end gap-0.5" style={{ height: 88 }}>
          {s.degCurve.map((d) => {
            const past = d.lap > s.pitWindow.closeLap - 1;
            const cliff = d.paceDelta > maxDeg * 0.7;
            return (
              <div
                key={d.lap}
                title={`Lap ${d.lap}: +${d.paceDelta.toFixed(2)} s/lap`}
                className="flex flex-1 flex-col items-center justify-end"
                style={{ height: "100%" }}
              >
                <span
                  className="w-full rounded-t-kdd-sm"
                  style={{
                    height: `${Math.max(4, (d.paceDelta / maxDeg) * 100)}%`,
                    backgroundColor: cliff
                      ? "var(--kdd-accent, #ef4444)"
                      : past
                        ? "var(--kdd-yellow, #eab308)"
                        : "var(--kdd-cyan, #22d3ee)",
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-1 flex justify-between font-kdd-mono text-[10px] text-kdd-dim">
          <span>Lap 1</span>
          <span className="text-kdd-accent">→ rear cliff → L{s.pitWindow.closeLap}</span>
          <span>Lap {s.raceLaps}</span>
        </div>
      </div>

      {/* ── Compounds + strategy options ────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel">
          <div className="mb-3 flex items-center gap-2">
            <CircleDot size={14} className="text-kdd-cyan" />
            <span className="font-kdd-mono text-[10px] font-bold uppercase tracking-[0.1em] text-kdd-dim">
              Tyre compounds
            </span>
          </div>
          <div className="space-y-2">
            {s.compounds.map((c, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="w-24 font-bold text-kdd-text">{c.position} {c.name}</span>
                <span className="w-24 font-kdd-mono text-xs text-kdd-dim">{c.degPerLap.toFixed(3)} s/lap</span>
                <span className="w-20 font-kdd-mono text-xs text-kdd-cyan">{c.window}</span>
                <span className="flex-1 truncate text-xs text-kdd-muted" title={c.note}>{c.note}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="mb-3 flex items-center gap-2">
            <Gauge size={14} className="text-kdd-purple" />
            <span className="font-kdd-mono text-[10px] font-bold uppercase tracking-[0.1em] text-kdd-dim">
              Strategy options · ranked
            </span>
          </div>
          <div className="space-y-2">
            {s.options.map((o: StrategyOption) => (
              <div key={o.id} className={`flex items-center gap-3 text-sm ${o.recommended ? "" : "opacity-80"}`}>
                <span
                  className={`h-2 w-2 flex-shrink-0 rounded-full ${o.recommended ? "bg-kdd-green" : "bg-kdd-dim"}`}
                />
                <span className="flex-1 font-semibold text-kdd-text">
                  {o.name}
                  {o.recommended && (
                    <span className="ml-2 font-kdd-mono text-[10px] text-kdd-green">PICK</span>
                  )}
                </span>
                <span className={`w-12 text-right font-kdd-mono text-xs ${o.projectedDelta === 0 ? "text-kdd-green" : "text-kdd-muted"}`}>
                  {o.projectedDelta === 0 ? "base" : `+${o.projectedDelta.toFixed(1)}s`}
                </span>
                <span className={`rounded-kdd-sm border px-1.5 py-0.5 font-kdd-mono text-[10px] capitalize ${riskBadgeClass(o.risk)}`}>
                  {o.risk}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-kdd-dim">
            Δ = projected race time vs the recommended baseline.
          </p>
        </div>
      </div>

      {/* ── Rival + weather ─────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="panel">
          <div className="mb-3 flex items-center gap-2">
            <Swords size={14} className="text-kdd-accent" />
            <span className="font-kdd-mono text-[10px] font-bold uppercase tracking-[0.1em] text-kdd-dim">
              Rival battle · undercut vs overcut
            </span>
          </div>
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-sm font-bold text-kdd-text">{s.rival.rival}</span>
            <span className="font-kdd-mono text-sm text-kdd-text">+{s.rival.gap.toFixed(1)}s</span>
            <span className={`font-kdd-mono text-xs ${s.rival.trend === "closing" ? "text-kdd-accent" : "text-kdd-muted"}`}>
              {s.rival.trend}
            </span>
            <span className="rounded-kdd-sm border border-kdd-cyan px-1.5 py-0.5 font-kdd-mono text-[10px] uppercase text-kdd-cyan">
              {s.rival.move}
            </span>
            <span className="font-kdd-mono text-xs text-kdd-green">+{s.rival.gainPerLap.toFixed(2)} s/lap</span>
          </div>
          <p className="mt-2 text-xs text-kdd-muted">
            Edge: <span className="text-kdd-text">{s.rival.where}</span>
          </p>
          <p className="mt-1 text-sm font-semibold text-kdd-text">{s.rival.verdict}</p>
        </div>

        <div className="panel">
          <div className="mb-3 flex items-center gap-2">
            <CloudRain size={14} className="text-kdd-yellow" />
            <span className="font-kdd-mono text-[10px] font-bold uppercase tracking-[0.1em] text-kdd-dim">
              Weather trigger
            </span>
          </div>
          <p className="text-sm font-bold text-kdd-text">{s.weather.condition}</p>
          <div className="mt-1 flex gap-4 font-kdd-mono text-xs">
            <span>prob <b className={s.weather.probability >= 0.5 ? "text-kdd-accent" : "text-kdd-text"}>{Math.round(s.weather.probability * 100)}%</b></span>
            <span>by <b className="text-kdd-text">L{s.weather.byLap}</b></span>
            <span className={s.weather.armed ? "text-kdd-yellow" : "text-kdd-dim"}>
              {s.weather.armed ? "— armed" : "— idle"}
            </span>
          </div>
          <p className="mt-1 text-xs text-kdd-yellow">{s.weather.action}</p>
        </div>
      </div>

      {/* ── Phase plan ─────────────────────────────────────────────── */}
      <div className="panel">
        <p className="mb-3 font-kdd-mono text-[10px] font-bold uppercase tracking-[0.1em] text-kdd-dim">
          Pace plan · push / manage by phase
        </p>
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${s.phasePlan.length}, 1fr)` }}>
          {s.phasePlan.map((p) => (
            <div key={p.phase} className={`border-t-2 ${phaseColor(p)} pt-2`}>
              <p className="text-sm font-bold text-kdd-text">{p.phase}</p>
              <p className="font-kdd-mono text-[10px] text-kdd-dim">Laps {p.laps}</p>
              <p className={`mt-0.5 font-kdd-mono text-[10px] uppercase ${
                p.mode === "attack" ? "text-kdd-accent" : p.mode === "push" ? "text-kdd-cyan" : "text-kdd-yellow"
              }`}>
                {p.mode}
              </p>
              <p className="mt-0.5 text-xs text-kdd-muted">{p.target}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Triggers + contingency ──────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="panel">
          <div className="mb-3 flex items-center gap-2">
            <ListChecks size={14} className="text-kdd-cyan" />
            <span className="font-kdd-mono text-[10px] font-bold uppercase tracking-[0.1em] text-kdd-dim">
              Live decision rules
            </span>
          </div>
          <div className="space-y-2">
            {s.triggers.map((t, i) => (
              <div key={i} className="flex items-baseline gap-2 text-xs">
                <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                  t.priority === "high" ? "bg-kdd-accent" : t.priority === "medium" ? "bg-kdd-yellow" : "bg-kdd-green"
                }`} />
                <span className="text-kdd-muted">
                  IF <span className="text-kdd-text">{t.when}</span> → <span className="text-kdd-cyan">{t.then}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <p className="mb-3 font-kdd-mono text-[10px] font-bold uppercase tracking-[0.1em] text-kdd-dim">
            Contingencies
          </p>
          <div className="space-y-2">
            {s.contingency.map((c, i) => (
              <p key={i} className="text-xs text-kdd-muted">— {c}</p>
            ))}
          </div>
        </div>
      </div>

      {/* ── Active modules from session ─────────────────────────────── */}
      <div className="panel">
        <p className="mb-2 font-kdd-mono text-[10px] font-bold uppercase tracking-[0.1em] text-kdd-dim">
          Active modules
        </p>
        <div className="flex flex-wrap gap-2">
          {session.activeModules.map((mod) => (
            <span
              key={mod}
              className="rounded-kdd-pill border border-kdd-border bg-kdd-surface px-2.5 py-1 font-kdd-mono text-[10px] text-kdd-muted"
            >
              {mod}
            </span>
          ))}
        </div>
      </div>

      <p className="font-kdd-mono text-[10px] text-kdd-dim italic">
        Representative strategy model derived from circuit length + corner count. Not a live timing or weather-radar feed.
      </p>
    </div>
  );
}
