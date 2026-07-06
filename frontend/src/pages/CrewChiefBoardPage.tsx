import { useState } from "react";
import { useRaceSession } from "../hooks/useRaceSession";
import {
  sessionBadgeLabel,
  getDegradationMessages,
  SESSION_BADGE_CLASSES,
} from "../lib/session-badge";
import {
  DEGRADATION_MESSAGES,
  getDegradationWarnings,
} from "../lib/session-degradation";
import type { SessionMode } from "../types/race-session";

type DecisionStatus =
  | "proposed"
  | "simulation_completed"
  | "crew_chief_review"
  | "approved"
  | "rejected";

type Decision = {
  id: string;
  title: string;
  risk: "low" | "medium" | "high";
  status: DecisionStatus;
  evidence: string;
  simulation?: string;
};

const initial: Decision[] = [
  {
    id: "dec-map2",
    title: "Switch to Engine Map 2 after lap 10",
    risk: "medium",
    status: "simulation_completed",
    evidence: "Progressive spin increase detected in long drive phases. Avg spin ratio: 0.078.",
    simulation: "sim-map2-jerez · lap delta −180ms estimated",
  },
  {
    id: "dec-rebound",
    title: "Increase rear rebound by 2 clicks",
    risk: "high",
    status: "crew_chief_review",
    evidence: "Rear instability observed during acceleration phase. IMU drift: 0.65.",
    simulation: undefined,
  },
];

const riskColor: Record<string, string> = { low: "badge-ok", medium: "badge-warn", high: "badge-danger" };

interface ModeRecommendation {
  focus: string;
  primary: string;
  secondary: string;
}

function getModeRecommendation(mode: SessionMode): ModeRecommendation {
  switch (mode) {
    case "race":
      return {
        focus: "Race mode — pit window, stint management, risk/reward active",
        primary: "Monitor pit window timing and stint tyre degradation",
        secondary: "Evaluate traffic impact and undercut/overcut opportunities",
      };
    case "qualifying":
      return {
        focus: "Qualifying mode — time attack, tyre warmup, sector optimization",
        primary: "Optimize out-lap timing and tyre window activation",
        secondary: "Sector-by-sector attack plan with traffic awareness",
      };
    case "practice":
      return {
        focus: "Practice mode — setup focus, learning, consistency",
        primary: "Collect setup references and corner-by-corner confidence data",
        secondary: "Validate tyre thermal behavior and suspension balance",
      };
    case "replay":
      return {
        focus: "Replay mode — debrief, evidence reconstruction",
        primary: "Reconstruct decision points from prior telemetry",
        secondary: "Compare lap-by-lap performance against baseline",
      };
    case "simulation":
      return {
        focus: "Simulation mode — predicted outcomes, what-if scenarios",
        primary: "Run scenario analysis with synthetic telemetry",
        secondary: "Evaluate confidence bounds on predicted recommendations",
      };
  }
}

export function CrewChiefBoardPage() {
  const { session, hasPersistedSession } = useRaceSession();
  const [decisions, setDecisions] = useState<Decision[]>(initial);
  const [expanded, setExpanded] = useState<string | null>(null);

  const update = (id: string, status: DecisionStatus) => {
    setDecisions((d) => d.map((dec) => (dec.id === id ? { ...dec, status } : dec)));
  };

  const badgeLabel = sessionBadgeLabel(session, hasPersistedSession);
  const degradationMessages = getDegradationMessages(
    session.telemetryStatus,
    session.circuitConfidence,
    session.dataSource,
  );

  const isMissingTelemetry = session.telemetryStatus === "missing";
  const isSimulation = session.dataSource === "simulation";

  const modeRec = getModeRecommendation(session.mode);

  return (
    <div className="bg-kdd-bg text-kdd-text space-y-6">
      <header>
        <div className="flex items-center gap-3">
          <p className="eyebrow">Crew Chief</p>
          <span className={SESSION_BADGE_CLASSES}>{badgeLabel}</span>
        </div>
        <h1 className="mt-2 text-3xl font-semibold">Decision board</h1>
        <p className="mt-2 max-w-3xl text-kdd-muted">
          {session.riderName} · {session.bikeName} · {session.circuitName} · {session.mode.toUpperCase()} mode
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
          <strong>{DEGRADATION_MESSAGES.demoRecommendations.split(".")[0]}.</strong> {DEGRADATION_MESSAGES.demoRecommendations.split(". ").slice(1).join(". ")}
        </div>
      )}

      {isSimulation && (
        <div className="rounded-kdd-md border border-kdd-cyan/40 bg-kdd-cyan-dim px-4 py-3 text-sm text-kdd-cyan">
          <strong>{DEGRADATION_MESSAGES.predictedRecommendations.split(".")[0]}.</strong> {DEGRADATION_MESSAGES.predictedRecommendations.split(". ").slice(1).join(". ")}
        </div>
      )}

      {/* Mode-appropriate strategy guidance */}
      <div className="panel border-t-2 border-t-kdd-cyan">
        <p className="font-kdd-mono text-[10px] font-bold uppercase tracking-[0.1em] text-kdd-dim">
          Mode Strategy
        </p>
        <p className="mt-2 text-sm font-semibold text-kdd-text">{modeRec.focus}</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <div className="rounded-kdd-md bg-kdd-surface px-3 py-2">
            <p className="text-xs text-kdd-dim">Primary</p>
            <p className="mt-0.5 text-sm text-kdd-text">{modeRec.primary}</p>
          </div>
          <div className="rounded-kdd-md bg-kdd-surface px-3 py-2">
            <p className="text-xs text-kdd-dim">Secondary</p>
            <p className="mt-0.5 text-sm text-kdd-text">{modeRec.secondary}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 text-sm">
        <div className="panel flex-1 text-center">
          <p className="text-kdd-dim">Pending Review</p>
          <p className="mt-1 text-3xl font-bold text-amber-400">
            {decisions.filter((d) => d.status === "crew_chief_review").length}
          </p>
        </div>
        <div className="panel flex-1 text-center">
          <p className="text-kdd-dim">Simulation Done</p>
          <p className="mt-1 text-3xl font-bold text-blue-400">
            {decisions.filter((d) => d.status === "simulation_completed").length}
          </p>
        </div>
        <div className="panel flex-1 text-center">
          <p className="text-kdd-dim">Approved</p>
          <p className="mt-1 text-3xl font-bold text-emerald-400">
            {decisions.filter((d) => d.status === "approved").length}
          </p>
        </div>
        <div className="panel flex-1 text-center">
          <p className="text-kdd-dim">Rejected</p>
          <p className="mt-1 text-3xl font-bold text-kdd-dim">
            {decisions.filter((d) => d.status === "rejected").length}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {decisions.map((dec) => (
          <div key={dec.id} className="panel space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{dec.title}</h2>
                <p className="mt-1 text-sm text-kdd-muted">{dec.evidence}</p>
                {dec.simulation && (
                  <p className="mt-1 text-xs text-kdd-dim">Simulation: {dec.simulation}</p>
                )}
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <span className="badge-neutral capitalize">{dec.status.replace(/_/g, " ")}</span>
                <span className={riskColor[dec.risk]}>risk: {dec.risk}</span>
              </div>
            </div>

            <div
              className="cursor-pointer text-xs text-kdd-dim underline"
              onClick={() => setExpanded(expanded === dec.id ? null : dec.id)}
            >
              {expanded === dec.id ? "Hide evidence" : "View evidence"}
            </div>

            {expanded === dec.id && (
              <div className="rounded-kdd-md bg-kdd-surface p-3 text-xs space-y-1">
                <p className="text-kdd-muted"><strong>Source:</strong> telemetry-session-api · confidence 0.91</p>
                <p className="text-kdd-muted"><strong>Pattern:</strong> tire_degradation · lap 9 · confidence 0.87</p>
                <p className="text-kdd-muted"><strong>Workflow:</strong> wf-fp2-jerez-2026</p>
              </div>
            )}

            {dec.status !== "approved" && dec.status !== "rejected" && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => update(dec.id, "approved")}
                  className="min-h-[44px] rounded-kdd-md bg-kdd-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-kdd-fast hover:bg-kdd-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-accent"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => update(dec.id, "rejected")}
                  className="min-h-[44px] rounded-kdd-md border border-kdd-border px-4 py-2 text-sm text-kdd-text transition-colors duration-kdd-fast hover:bg-kdd-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-accent"
                >
                  Reject
                </button>
                {!dec.simulation && (
                  <button
                    type="button"
                    onClick={() => update(dec.id, "simulation_completed")}
                    className="min-h-[44px] rounded-kdd-md border border-kdd-border px-4 py-2 text-sm text-kdd-text transition-colors duration-kdd-fast hover:bg-kdd-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-accent"
                  >
                    Request Simulation
                  </button>
                )}
                <button type="button" className="min-h-[44px] rounded-kdd-md border border-kdd-border px-4 py-2 text-sm text-kdd-text transition-colors duration-kdd-fast hover:bg-kdd-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-accent">
                  Generate Report
                </button>
              </div>
            )}

            {(dec.status === "approved" || dec.status === "rejected") && (
              <p className="text-sm font-medium capitalize text-kdd-green">
                {dec.status} by crew chief
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
