/**
 * CockpitPage — Adaptive Pit-Wall Cockpit.
 *
 * The operational surface where KDD turns telemetry into track decisions.
 *
 * Migrated from 13-ui-command-center/src/pages/CockpitPage.tsx
 * CSS classes replaced with Tailwind kdd-* utilities.
 */
import { useState } from "react";
import { ArrowRight, LayoutGrid, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/cn";
import { useRaceSession } from "../hooks/useRaceSession";
import {
  sessionBadgeLabel,
  SESSION_BADGE_CLASSES,
} from "../lib/session-badge";
import {
  decideCockpit,
  modeMeta,
  COCKPIT_SCENARIOS,
  type CockpitContext,
  type CockpitMode,
  type SessionPhase,
} from "../data/cockpit-data";
import { DATA_SOURCES, SESSION_MODES, TELEMETRY_STATUSES, type RaceSessionContext } from "../types/race-session";

type LayoutMode = "adaptive" | "manual" | "hybrid";

function scenarioForSession(): string {
  return "live";
}

function sessionPhaseForContext(session: RaceSessionContext): SessionPhase {
  if (session.mode === SESSION_MODES.REPLAY) return "post";
  return "live";
}

function cockpitContextFromSession(
  baseContext: CockpitContext,
  session: RaceSessionContext,
  hasPersistedSession: boolean,
): CockpitContext {
  return {
    ...baseContext,
    sessionPhase: sessionPhaseForContext(session),
    activeExperiment: session.activeModules.includes("decision-audit") || session.activeModules.includes("scenario-risk"),
    dataIntegrityOk: session.telemetryStatus === TELEMETRY_STATUSES.READY,
    demo: !hasPersistedSession || session.dataSource === DATA_SOURCES.DEMO,
    oraclePending: session.activeModules.includes("crew-chief-approval") || baseContext.oraclePending,
  };
}

function scoreTone(score: number): "high" | "medium" | "low" {
  if (score >= 80) return "high";
  if (score >= 60) return "medium";
  return "low";
}

function riskTone(risk: string): "high" | "medium" | "low" {
  const normalized = risk.toLowerCase();
  if (normalized.includes("high")) return "high";
  if (normalized.includes("medium")) return "medium";
  return "low";
}

function modeAccent(mode: CockpitMode): string {
  const map: Record<CockpitMode, string> = {
    "pre-session": "border-t-kdd-cyan",
    "live-stint": "border-t-kdd-green",
    alert: "border-t-kdd-accent",
    experiment: "border-t-kdd-purple",
    "post-stint": "border-t-kdd-orange",
    demo: "border-t-kdd-purple",
    simulation: "border-t-kdd-cyan",
    degraded: "border-t-kdd-orange",
  };
  return map[mode];
}

function riskBorder(risk: string): string {
  const t = riskTone(risk);
  if (t === "high") return "border-kdd-accent/40";
  if (t === "medium") return "border-kdd-orange/40";
  return "border-kdd-green/30";
}

const TAB_ROUTES: Record<string, string> = {
  telemetry: "/telemetry",
  circuit: "/circuit",
  corners: "/circuit",
  risk: "/tires",
  tires: "/tires",
  "ai-crew": "/copilot",
  report: "/reports",
  twin: "/digital-twin",
  advisor: "/setup",
  style: "/reports",
  "pre-gp": "/pre-gp",
  experiments: "/reports",
  "black-box": "/reports",
  "track-evo": "/circuit",
  overview: "/",
  data: "/settings",
  "pit-radio": "/crew-chief",
};

/* ── Reusable button styles ───────────────────────────────────────────── */

const CHIP_BASE =
  "inline-flex items-center justify-center gap-1.5 min-h-[44px] rounded-md border border-kdd-border bg-transparent text-kdd-dim font-kdd-mono text-[11px] font-bold cursor-pointer transition-colors duration-kdd-fast hover:bg-kdd-surface-faint hover:border-kdd-border-bright hover:text-kdd-text focus-visible:outline-2 focus-visible:outline-kdd-accent focus-visible:outline-offset-2 px-3";

const CHIP_ACTIVE =
  "bg-kdd-surface-soft border-kdd-border-bright text-kdd-text";

const ACTION_BTN =
  "inline-flex items-center justify-center gap-1.5 shrink-0 min-h-[44px] rounded-md border border-transparent bg-kdd-accent text-white font-kdd-mono text-[11px] font-bold cursor-pointer transition-colors duration-kdd-fast hover:bg-kdd-accent-hover focus-visible:outline-2 focus-visible:outline-kdd-accent focus-visible:outline-offset-2 px-3.5";

/* ── Priority item styles (per score tone) ────────────────────────────── */

function priorityBarWidth(tone: "high" | "medium" | "low"): string {
  if (tone === "high") return "w-[88%]";
  if (tone === "medium") return "w-[66%]";
  return "w-[38%]";
}

function priorityBarColor(tone: "high" | "medium" | "low"): string {
  if (tone === "high") return "bg-kdd-accent";
  if (tone === "medium") return "bg-kdd-cyan";
  return "bg-white/25";
}

function priorityScoreColor(tone: "high" | "medium" | "low"): string {
  if (tone === "high") return "text-kdd-text";
  if (tone === "medium") return "text-kdd-cyan";
  return "text-kdd-dim";
}

/* ── Component ────────────────────────────────────────────────────────── */

export function CockpitPage() {
  const navigate = useNavigate();
  const { session, hasPersistedSession } = useRaceSession();
  const [scenarioId, setScenarioId] = useState(scenarioForSession());
  const [layout, setLayout] = useState<LayoutMode>("adaptive");
  const [pinned, setPinned] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const scenario =
    COCKPIT_SCENARIOS.find((s) => s.id === scenarioId) ?? COCKPIT_SCENARIOS[0];
  const ctx: CockpitContext = cockpitContextFromSession(scenario.ctx, session, hasPersistedSession);
  const layoutOut = decideCockpit(ctx);
  const mm = modeMeta(layoutOut.mode);
  const sessionBadge = sessionBadgeLabel(session, hasPersistedSession);
  const showSuggestion =
    layout === "hybrid" && layoutOut.suggestion && !pinned && !dismissed;

  const navigateToTab = (tab: string) => {
    const route = TAB_ROUTES[tab];
    if (route) {
      navigate(route);
    } else {
      console.warn(`[CockpitPage] Unknown tab: ${tab}`);
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="inline-flex items-center gap-2 text-xl font-bold text-kdd-text">
            <LayoutGrid size={18} />
            Adaptive Pit-Wall Cockpit
          </h1>
          <p className="text-sm text-kdd-muted mt-1">
            Context-aware dashboard for race decisions — the dashboard adapts
            to the track, not the other way round
          </p>
        </div>

        <div className="rounded-kdd-md border border-kdd-border bg-kdd-card px-4 py-3 text-sm text-kdd-text">
          <span className="font-kdd-mono text-[10px] uppercase tracking-[0.2em] text-kdd-muted">
            Session state
          </span>
          <div className="mt-1 font-kdd-mono text-kdd-cyan">
            {session.mode.toUpperCase()} · {session.circuitName}
          </div>
          <span className={SESSION_BADGE_CLASSES}>
            {sessionBadge}
          </span>
        </div>

        {/* Layout mode switch */}
        <div
          className="flex items-center flex-wrap gap-2"
          aria-label="Cockpit layout mode"
        >
          {(["adaptive", "hybrid", "manual"] as LayoutMode[]).map((m) => (
            <button
              key={m}
              type="button"
              className={cn(CHIP_BASE, layout === m && CHIP_ACTIVE)}
              aria-pressed={layout === m}
              onClick={() => {
                setLayout(m);
                setDismissed(false);
                setPinned(false);
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </header>

      <section
        className="grid grid-cols-1 gap-3 rounded-kdd-lg border border-kdd-border bg-kdd-card p-4 md:grid-cols-2 xl:grid-cols-4"
        aria-label="Race session context"
      >
        <div className="rounded-kdd-md border border-kdd-border bg-kdd-surface p-3">
          <span className="block text-xs text-kdd-dim">Circuit</span>
          <strong className="font-kdd-mono text-sm text-kdd-text">{session.circuitName}</strong>
          <span className="mt-1 block font-kdd-mono tabular-nums text-[11px] text-kdd-cyan">
            {session.circuitId} · confidence {session.circuitConfidence}%
          </span>
        </div>
        <div className="rounded-kdd-md border border-kdd-border bg-kdd-surface p-3">
          <span className="block text-xs text-kdd-dim">Rider</span>
          <strong className="font-kdd-mono text-sm text-kdd-text">{session.riderName}</strong>
          <span className="mt-1 block font-kdd-mono text-[11px] text-kdd-muted">{session.riderId}</span>
        </div>
        <div className="rounded-kdd-md border border-kdd-border bg-kdd-surface p-3">
          <span className="block text-xs text-kdd-dim">Bike</span>
          <strong className="font-kdd-mono text-sm text-kdd-text">{session.bikeName}</strong>
          <span className="mt-1 block font-kdd-mono text-[11px] text-kdd-muted">{session.bikeId}</span>
        </div>
        <div className="rounded-kdd-md border border-kdd-border bg-kdd-surface p-3">
          <span className="block text-xs text-kdd-dim">Feed</span>
          <strong className="font-kdd-mono text-sm text-kdd-text">
            {session.dataSource} · {session.telemetryStatus}
          </strong>
          <span className="mt-1 block font-kdd-mono text-[11px] text-kdd-muted">
            {session.activeModules.length} active modules
          </span>
        </div>
        <div className="rounded-kdd-md border border-kdd-border bg-kdd-surface p-3 md:col-span-2 xl:col-span-4">
          <span className="block text-xs text-kdd-dim">Active modules</span>
          <strong className="font-kdd-mono text-sm text-kdd-text">
            {session.activeModules.join(" · ")}
          </strong>
        </div>
      </section>

      {/* ── Scenario context ──────────────────────────────────────────── */}
      <section
        className="flex items-center flex-wrap gap-2 mb-1"
        aria-label="Cockpit preview context"
      >
        <span className="font-kdd-mono text-[10px] font-bold tracking-[0.1em] uppercase text-kdd-dim">
          Context
        </span>
        {COCKPIT_SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={cn(CHIP_BASE, s.id === scenarioId && CHIP_ACTIVE)}
            aria-pressed={s.id === scenarioId}
            onClick={() => {
              setScenarioId(s.id);
              setDismissed(false);
              setPinned(false);
            }}
          >
            {s.label}
          </button>
        ))}
      </section>

      {/* ── Status ────────────────────────────────────────────────────── */}
      <section
        className={cn(
          "rounded-lg border bg-kdd-card p-4 border-t-2 flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-stretch",
          modeAccent(layoutOut.mode),
        )}
        aria-label="Current cockpit state"
      >
        <div className="flex items-center flex-wrap gap-3">
          <span className="font-kdd-mono text-sm font-black tracking-[0.08em] text-kdd-text">
            {mm.label}
          </span>
          <span className="text-xs text-kdd-dim">{layoutOut.trigger}</span>
        </div>
        <blockquote className="text-right max-sm:text-left text-xs italic text-kdd-text m-0">
          &ldquo;{layoutOut.oracleVerdict}&rdquo;
        </blockquote>
      </section>

      {/* ── Hybrid suggestion ─────────────────────────────────────────── */}
      {showSuggestion && (
        <section
          className="flex items-center gap-3 rounded-lg border border-kdd-purple/35 bg-kdd-card p-4 max-sm:flex-col max-sm:items-stretch"
          aria-label="Hybrid cockpit suggestion"
        >
          <Sparkles size={15} className="text-kdd-purple shrink-0" />
          <span className="flex-1 text-sm leading-relaxed text-kdd-text">
            KDD suggests switching to{" "}
            <b className="text-kdd-purple">
              {modeMeta(layoutOut.suggestion!.toMode).label}
            </b>{" "}
            — {layoutOut.suggestion!.reason}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className={cn(CHIP_BASE, "text-kdd-green border-kdd-green/40")}
              onClick={() => setLayout("adaptive")}
            >
              Accept
            </button>
            <button
              type="button"
              className={CHIP_BASE}
              onClick={() => setDismissed(true)}
            >
              Ignore
            </button>
            <button
              type="button"
              className={cn(CHIP_BASE, "text-kdd-cyan border-kdd-cyan/40")}
              onClick={() => setPinned(true)}
            >
              Pin current
            </button>
          </div>
        </section>
      )}

      {/* ── Main grid ─────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.85fr] gap-4 items-start">
        {/* ── Stack: Primary + Next Best Action ──────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Primary panel */}
          <article
            className={cn(
              "rounded-lg border bg-kdd-card p-4 border-t-2",
              modeAccent(layoutOut.mode),
            )}
          >
            <span className="font-kdd-mono text-[10px] font-bold tracking-[0.1em] uppercase text-kdd-dim">
              Primary panel
            </span>

            <div className="flex items-center justify-between gap-4 mt-2 max-sm:flex-col max-sm:items-stretch">
              <div>
                <h2 className="text-[22px] font-extrabold leading-tight text-kdd-text m-0">
                  {layoutOut.primary.label}
                </h2>
                <p className="text-xs text-kdd-dim mt-1.5 leading-relaxed">
                  Current operating surface selected by KDD for this session
                  context.
                </p>
              </div>
              <button
                type="button"
                className={cn(ACTION_BTN, "max-sm:w-full")}
                onClick={() => navigateToTab(layoutOut.primary.tab)}
              >
                Open <ArrowRight size={13} />
              </button>
            </div>

            {/* Decision chain */}
            <div
              className="grid grid-cols-6 max-sm:grid-cols-2 gap-1.5 mt-4"
              aria-label="Decision chain"
            >
              {[
                "Data",
                "Event",
                "Cause",
                "Recommendation",
                "Mission",
                "Validation",
              ].map((item) => (
                <span
                  key={item}
                  className="min-h-[36px] inline-flex items-center justify-center rounded-md border border-kdd-border bg-kdd-surface-faint text-kdd-dim font-kdd-mono text-[10px] font-bold"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Supporting panels */}
            <span className="font-kdd-mono text-[10px] font-bold tracking-[0.1em] uppercase text-kdd-dim block mt-4 mb-2">
              Supporting panels
            </span>
            <div className="flex items-center flex-wrap gap-2">
              {layoutOut.supporting.map((s) => (
                <button
                  key={s.tab}
                  type="button"
                  className={CHIP_BASE}
                  onClick={() => navigateToTab(s.tab)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </article>

          {/* Next best action */}
          <article
            className={cn(
              "rounded-lg border bg-kdd-card p-4 bg-kdd-cyan-dim",
              riskBorder(layoutOut.nextBestAction.risk),
            )}
          >
            <div className="flex items-center flex-wrap gap-2 mb-2 text-kdd-cyan font-kdd-mono text-[10px] font-extrabold tracking-[0.08em] uppercase">
              <Zap size={15} />
              <span>Next best action</span>
              <strong className="text-kdd-text">
                {layoutOut.nextBestAction.priority}
              </strong>
            </div>
            <h2 className="text-[22px] font-extrabold leading-tight text-kdd-text m-0">
              {layoutOut.nextBestAction.action}
            </h2>
            <p className="text-xs text-kdd-dim mt-1.5 leading-relaxed">
              {layoutOut.nextBestAction.why}
            </p>
            <div className="flex items-center flex-wrap gap-2 mt-3">
              <span className="inline-flex gap-1.5 text-xs text-kdd-text">
                <b className="text-kdd-muted font-semibold">Expected</b>
                {layoutOut.nextBestAction.expectedGain}
              </span>
              <span className="inline-flex gap-1.5 text-xs text-kdd-text">
                <b className="text-kdd-muted font-semibold">Risk</b>
                {layoutOut.nextBestAction.risk}
              </span>
            </div>
          </article>
        </div>

        {/* ── Priority engine sidebar ─────────────────────────────────── */}
        <aside
          className="rounded-lg border bg-kdd-card p-4 lg:sticky lg:top-3"
          aria-label="Priority engine live module scores"
        >
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <span className="font-kdd-mono text-[10px] font-bold tracking-[0.1em] uppercase text-kdd-dim">
              Priority engine
            </span>
            <strong className="font-kdd-mono text-[11px] text-kdd-text">
              Live module scores
            </strong>
          </div>

          <div className="grid gap-2">
            {layoutOut.priorities.slice(0, 9).map((p, index) => {
              const tone = scoreTone(p.score);
              return (
                <button
                  key={p.tab}
                  type="button"
                  className="grid grid-cols-[32px_1fr_72px_34px] max-sm:grid-cols-[30px_1fr_32px] items-center gap-2.5 min-h-[44px] w-full rounded-md border border-kdd-border bg-transparent text-left cursor-pointer transition-colors duration-kdd-fast hover:bg-kdd-surface-faint hover:border-kdd-border-bright focus-visible:outline-2 focus-visible:outline-kdd-accent focus-visible:outline-offset-2"
                  onClick={() => navigateToTab(p.tab)}
                  aria-label={`Open ${p.label}, priority score ${p.score}`}
                >
                  {/* Rank */}
                  <span className="font-kdd-mono tabular-nums text-[11px] font-extrabold text-center text-kdd-dim">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {/* Label */}
                  <span className="text-kdd-text text-xs font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                    {p.label}
                  </span>
                  {/* Score bar */}
                  <span
                    className="h-[7px] overflow-hidden rounded-[99px] bg-white/5 max-sm:col-span-2"
                    aria-hidden="true"
                  >
                    <span
                      className={cn(
                        "block h-full rounded-[inherit] origin-left",
                        priorityBarWidth(tone),
                        priorityBarColor(tone),
                      )}
                    />
                  </span>
                  {/* Score */}
                  <span
                    className={cn(
                      "font-kdd-mono tabular-nums text-[11px] font-extrabold text-center",
                      priorityScoreColor(tone),
                    )}
                  >
                    {p.score}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-kdd-dim mt-1">
            {layout === "manual"
              ? "Manual layout — you pin the modules; the engine only advises."
              : layout === "hybrid"
                ? "Hybrid — KDD suggests, you accept or pin."
                : "Adaptive — the cockpit reorganises automatically."}
          </p>
        </aside>
      </section>
    </div>
  );
}
