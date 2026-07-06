import { useState } from "react";
import { useRaceSession } from "../hooks/useRaceSession";
import {
  sessionBadgeLabel,
  getDegradationMessages,
  SESSION_BADGE_CLASSES,
} from "../lib/session-badge";
import { DEGRADATION_MESSAGES } from "../lib/session-degradation";

const BASELINE = {
  id: "setup-base-jerez",
  name: "Baseline Jerez",
  front_preload: 12, rear_preload: 14,
  front_compression: 18, rear_compression: 20,
  front_rebound: 16, rear_rebound: 18,
  engine_map: "map-1", tc_map: "tc-3",
  anti_wheelie: "aw-2", engine_brake: "eb-2",
  front_pressure: 1.95, rear_pressure: 1.85,
  front_compound: "medium", rear_compound: "soft",
  aero: "A",
};

const PROPOSED = {
  id: "setup-q-jerez",
  name: "Qualifying Jerez",
  front_preload: 12, rear_preload: 15,
  front_compression: 18, rear_compression: 21,
  front_rebound: 16, rear_rebound: 20,
  engine_map: "map-2", tc_map: "tc-2",
  anti_wheelie: "aw-1", engine_brake: "eb-2",
  front_pressure: 1.90, rear_pressure: 1.80,
  front_compound: "soft", rear_compound: "soft",
  aero: "A",
};

type SetupKey = keyof typeof BASELINE;

const rows: { key: SetupKey; label: string; unit: string }[] = [
  { key: "front_preload", label: "Front Preload", unit: "clicks" },
  { key: "rear_preload", label: "Rear Preload", unit: "clicks" },
  { key: "front_compression", label: "Front Compression", unit: "clicks" },
  { key: "rear_compression", label: "Rear Compression", unit: "clicks" },
  { key: "front_rebound", label: "Front Rebound", unit: "clicks" },
  { key: "rear_rebound", label: "Rear Rebound", unit: "clicks" },
  { key: "engine_map", label: "Engine Map", unit: "" },
  { key: "tc_map", label: "TC Map", unit: "" },
  { key: "anti_wheelie", label: "Anti-Wheelie", unit: "" },
  { key: "front_pressure", label: "Front Pressure", unit: "bar" },
  { key: "rear_pressure", label: "Rear Pressure", unit: "bar" },
  { key: "front_compound", label: "Front Compound", unit: "" },
  { key: "rear_compound", label: "Rear Compound", unit: "" },
];

export function SetupManagementPage() {
  const { session, hasPersistedSession } = useRaceSession();
  const [view, setView] = useState<"diff" | "baseline" | "proposed">("diff");

  const changes = rows.filter((r) => String(BASELINE[r.key]) !== String(PROPOSED[r.key]));

  const badgeLabel = sessionBadgeLabel(session, hasPersistedSession);
  const degradationMessages = getDegradationMessages(
    session.telemetryStatus,
    session.circuitConfidence,
    session.dataSource,
  );

  const isMissingTelemetry = session.telemetryStatus === "missing";
  const isPartialTelemetry = session.telemetryStatus === "partial";
  const isSimulation = session.dataSource === "simulation";

  return (
    <div className="bg-kdd-bg text-kdd-text space-y-6">
      <header>
        <div className="flex items-center gap-3">
          <p className="eyebrow">Setup Management</p>
          <span className={SESSION_BADGE_CLASSES}>{badgeLabel}</span>
        </div>
        <h1 className="mt-2 text-3xl font-semibold">Setup comparison & tracking</h1>
        <p className="mt-2 text-kdd-muted">
          {session.circuitName} · {session.riderName} · {session.bikeName} · {session.mode.toUpperCase()} mode
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
          <strong>{DEGRADATION_MESSAGES.demoSetupPreview.split(".")[0]}.</strong> {DEGRADATION_MESSAGES.demoSetupPreview.split(". ").slice(1).join(". ")}
        </div>
      )}

      {isPartialTelemetry && !isMissingTelemetry && (
        <div className="rounded-kdd-md border border-kdd-yellow/40 bg-kdd-yellow-dim px-4 py-3 text-sm text-kdd-yellow">
          <strong>{DEGRADATION_MESSAGES.partialTelemetrySetup.split(".")[0]}.</strong> {DEGRADATION_MESSAGES.partialTelemetrySetup.split(". ").slice(1).join(". ")}
        </div>
      )}

      {isSimulation && (
        <div className="rounded-kdd-md border border-kdd-cyan/40 bg-kdd-cyan-dim px-4 py-3 text-sm text-kdd-cyan">
          <strong>{DEGRADATION_MESSAGES.predictedSetup.split(".")[0]}.</strong> {DEGRADATION_MESSAGES.predictedSetup.split(". ").slice(1).join(". ")}
        </div>
      )}

      <div className="flex gap-2">
        {(["diff", "baseline", "proposed"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`min-h-[44px] rounded-kdd-md px-4 py-2 text-sm font-medium transition-colors ${
              view === v ? "bg-kdd-accent text-white" : "border border-kdd-border text-kdd-muted hover:text-kdd-text"
            }`}
          >
            {v === "diff" ? "Show Diff" : v === "baseline" ? "Baseline" : "Proposed"}
          </button>
        ))}
      </div>

      <div className="panel overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-kdd-border bg-kdd-surface">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-kdd-dim">
                Parameter
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-kdd-dim">
                Baseline
              </th>
              {view !== "baseline" && (
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-kdd-dim">
                  Proposed
                </th>
              )}
              {view === "diff" && (
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-kdd-dim">
                  Change
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {(view === "diff" ? changes : rows).map(({ key, label, unit }) => {
              const bval = BASELINE[key];
              const pval = PROPOSED[key];
              const changed = String(bval) !== String(pval);
              return (
                <tr
                  key={key}
                  className={`border-b border-kdd-border ${changed && view === "diff" ? "bg-amber-950/10" : ""}`}
                >
                  <td className="px-4 py-3 text-kdd-text">{label}</td>
                  <td className="px-4 py-3 font-kdd-mono text-kdd-muted">
                    {bval}{unit && ` ${unit}`}
                  </td>
                  {view !== "baseline" && (
                    <td className={`px-4 py-3 font-kdd-mono ${changed ? "text-amber-400 font-semibold" : "text-kdd-muted"}`}>
                      {pval}{unit && ` ${unit}`}
                    </td>
                  )}
                  {view === "diff" && (
                    <td className="px-4 py-3">
                      <span className="badge-warn">changed</span>
                    </td>
                  )}
                </tr>
              );
            })}
            {view === "diff" && changes.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-kdd-dim">
                  No differences found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {view === "diff" && (
        <div className="flex items-center justify-between rounded-kdd-md border border-kdd-border bg-kdd-surface px-4 py-3">
          <span className="text-sm text-kdd-muted">
            {changes.length} parameter{changes.length !== 1 ? "s" : ""} changed · Risk: medium
          </span>
          <div className="flex gap-2">
            <button type="button" className="min-h-[44px] rounded-kdd-md border border-kdd-border px-4 py-2 text-sm text-kdd-text transition-colors duration-kdd-fast hover:bg-kdd-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-accent">
              Request Simulation
            </button>
            <button type="button" className="min-h-[44px] rounded-kdd-md bg-kdd-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-kdd-fast hover:bg-kdd-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-accent">
              Propose to Crew Chief
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
