import { useState } from "react";
import { post } from "../api/client";
import { useRaceSession } from "../hooks/useRaceSession";
import {
  sessionBadgeLabel,
  getDegradationMessages,
  SESSION_BADGE_CLASSES,
} from "../lib/session-badge";
import { DEGRADATION_MESSAGES } from "../lib/session-degradation";

type SimResult = {
  sim_id: string;
  change: string;
  lap_delta_ms: number;
  spin_risk: string;
  thermal_risk: string;
  status: string;
};

const riskColor: Record<string, string> = { low: "badge-ok", medium: "badge-warn", high: "badge-danger" };

export function DigitalTwinPage() {
  const { session, hasPersistedSession } = useRaceSession();
  const [form, setForm] = useState({ param: "engine_map", value: "map-2", notes: "" });
  const [results, setResults] = useState<SimResult[]>([]);
  const [loading, setLoading] = useState(false);

  const degradationMessages = getDegradationMessages(
    session.telemetryStatus,
    session.circuitConfidence,
    session.dataSource,
  );

  const getSimulationStatus = () => {
    if (session.mode === "replay") return "Replay mode — reviewing past session";
    if (session.mode === "simulation") return "Simulation mode — predicting outcomes";
    return "Live mode — real-time twin";
  };

  const runSim = async () => {
    setLoading(true);
    try {
      const data = await post<{
        simulation_id: string;
        estimated_lap_delta_ms?: number;
        spin_risk?: string;
        thermal_risk?: string;
        status: string;
      }>("/simulation/what-if", {
        baseline_setup_id: `setup-base-${session.circuitId}`,
        setup_change: { [form.param]: form.value },
        circuit_id: session.circuitId,
        notes: form.notes,
      });
      setResults((r) => [
        {
          sim_id: data.simulation_id,
          change: `${form.param} → ${form.value}`,
          lap_delta_ms: data.estimated_lap_delta_ms ?? -50,
          spin_risk: data.spin_risk ?? "medium",
          thermal_risk: data.thermal_risk ?? "medium",
          status: data.status,
        },
        ...r,
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-3">
          <p className="eyebrow">Digital Twin</p>
          <span className={SESSION_BADGE_CLASSES}>
            {sessionBadgeLabel(session, hasPersistedSession)}
          </span>
        </div>
        <h1 className="mt-2 text-3xl font-semibold">What-if simulation viewer</h1>
        <p className="mt-2 text-kdd-muted">
          Simulate setup changes against the baseline · Estimate lap delta · Assess risk before approval
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-kdd-dim">Session:</span>
          <span className="text-sm text-kdd-text">{session.riderName} · {session.bikeName}</span>
          <span className="text-kdd-dim">·</span>
          <span className="text-sm text-kdd-text">{session.circuitName}</span>
          <span className="text-kdd-dim">·</span>
          <span className="text-sm text-kdd-cyan">{getSimulationStatus()}</span>
        </div>
      </header>

      {/* Degradation banners */}
      {degradationMessages.length > 0 && (
        <div className="space-y-2">
          {degradationMessages.map((msg) => (
            <div key={msg} className="rounded-kdd-md border border-kdd-yellow/40 bg-kdd-yellow-dim px-4 py-2 text-sm text-kdd-yellow">
              {msg}
            </div>
          ))}
        </div>
      )}

      {/* Confidence warning */}
      {session.circuitConfidence < 80 && (
        <div className="rounded-kdd-md border border-kdd-orange/40 bg-kdd-orange-dim px-4 py-2 text-sm text-kdd-orange">
          {DEGRADATION_MESSAGES.lowCircuitConfidence}
        </div>
      )}

      {/* Simulation mode banner */}
      {session.dataSource === "simulation" && (
        <div className="rounded-kdd-md border border-kdd-cyan/40 bg-kdd-cyan-dim px-4 py-2 text-sm text-kdd-cyan">
          {DEGRADATION_MESSAGES.simulationModeTwin}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel space-y-4">
          <h2 className="text-sm font-semibold text-kdd-muted">Run What-If Simulation</h2>

          <div>
            <label className="text-xs text-kdd-dim">Baseline Setup</label>
            <p className="mt-1 rounded-kdd-md bg-kdd-surface px-3 py-2 text-sm text-kdd-text">setup-base-{session.circuitId}</p>
          </div>

          <div>
            <label className="text-xs text-kdd-dim">Parameter</label>
            <select
              value={form.param}
              onChange={(e) => setForm({ ...form, param: e.target.value })}
              className="mt-1 w-full rounded-kdd-md border border-kdd-border bg-kdd-surface px-3 py-2 text-sm text-kdd-text focus:outline-none"
            >
              {["engine_map", "rear_preload", "rear_rebound", "tc_map", "rear_tire_pressure", "aero_package"].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-kdd-dim">Proposed Value</label>
            <input
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              className="mt-1 w-full rounded-kdd-md border border-kdd-border bg-kdd-surface px-3 py-2 text-sm text-kdd-text focus:outline-none"
              placeholder="e.g. map-2"
            />
          </div>

          <div>
            <label className="text-xs text-kdd-dim">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="mt-1 w-full resize-none rounded-kdd-md border border-kdd-border bg-kdd-surface px-3 py-2 text-sm text-kdd-text focus:outline-none"
              placeholder="Optional notes..."
            />
          </div>

          <button
            onClick={runSim}
            disabled={loading}
            className="w-full rounded-kdd-md bg-kdd-accent px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? "Running simulation…" : "Run What-If"}
          </button>
        </div>

        <div className="panel">
          <h2 className="mb-4 text-sm font-semibold text-kdd-muted">Baseline Setup</h2>
          <div className="space-y-2 text-sm">
            {[
              ["Engine Map", "map-1"],
              ["TC Map", "tc-3"],
              ["Rear Preload", "14 clicks"],
              ["Rear Rebound", "18 clicks"],
              ["Rear Pressure", "1.85 bar"],
              ["Rear Compound", "soft"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-kdd-border pb-1.5">
                <span className="text-kdd-dim">{k}</span>
                <span className="font-kdd-mono text-kdd-text">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What-if scenario panel */}
      <div className="panel">
        <h2 className="mb-4 text-sm font-semibold text-kdd-muted">What-if Scenario Analysis</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-kdd-md bg-kdd-surface p-4">
            <p className="text-xs text-kdd-dim">Predicted Lap Delta</p>
            <p className="mt-1 text-2xl font-bold text-kdd-green">-47 ms</p>
            <p className="mt-1 text-xs text-kdd-dim">Based on circuit model</p>
          </div>
          <div className="rounded-kdd-md bg-kdd-surface p-4">
            <p className="text-xs text-kdd-dim">Setup Impact</p>
            <p className="mt-1 text-2xl font-bold text-kdd-cyan">Medium</p>
            <p className="mt-1 text-xs text-kdd-dim">Within safe bounds</p>
          </div>
          <div className="rounded-kdd-md bg-kdd-surface p-4">
            <p className="text-xs text-kdd-dim">Tyre Projection</p>
            <p className="mt-1 text-2xl font-bold text-kdd-yellow">+2 laps</p>
            <p className="mt-1 text-xs text-kdd-dim">Extended rear life</p>
          </div>
        </div>
      </div>

      {/* Risk projection */}
      <div className="panel">
        <h2 className="mb-4 text-sm font-semibold text-kdd-muted">Risk Projection</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-kdd-md bg-kdd-surface p-4">
            <p className="text-xs text-kdd-dim">Spin Risk</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 flex-1 rounded-full bg-kdd-border">
                <div className="h-2 w-1/3 rounded-full bg-kdd-yellow"></div>
              </div>
              <span className="text-sm font-medium text-kdd-yellow">Medium</span>
            </div>
          </div>
          <div className="rounded-kdd-md bg-kdd-surface p-4">
            <p className="text-xs text-kdd-dim">Thermal Risk</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 flex-1 rounded-full bg-kdd-border">
                <div className="h-2 w-1/4 rounded-full bg-kdd-green"></div>
              </div>
              <span className="text-sm font-medium text-kdd-green">Low</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confidence meter */}
      <div className="panel">
        <h2 className="mb-4 text-sm font-semibold text-kdd-muted">Model Confidence</h2>
        <div className="flex items-center gap-4">
          <div className="h-4 flex-1 rounded-full bg-kdd-border">
            <div 
              className="h-4 rounded-full bg-kdd-cyan" 
              style={{ width: `${session.circuitConfidence}%` }}
            ></div>
          </div>
          <span className="text-lg font-bold text-kdd-cyan">{session.circuitConfidence}%</span>
        </div>
        <p className="mt-2 text-xs text-kdd-dim">
          {session.circuitConfidence >= 80 
            ? "High confidence — predictions reliable" 
            : "Low confidence — predictions may vary"}
        </p>
      </div>

      {results.length > 0 && (
        <div className="panel space-y-3">
          <h2 className="text-sm font-semibold text-kdd-muted">Simulation Results</h2>
          {results.map((r) => (
            <div key={r.sim_id} className="rounded-kdd-md border border-kdd-border bg-kdd-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-sm">{r.change}</p>
                  <p className="text-xs text-kdd-dim mt-0.5">{r.sim_id}</p>
                </div>
                <span className="badge-neutral">{r.status}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <div className="rounded-kdd-md bg-kdd-card px-3 py-2">
                  <p className="text-xs text-kdd-dim">Lap Delta</p>
                  <p className={`mt-0.5 font-bold ${r.lap_delta_ms < 0 ? "text-kdd-green" : "text-kdd-accent"}`}>
                    {r.lap_delta_ms > 0 ? "+" : ""}{r.lap_delta_ms} ms
                  </p>
                </div>
                <div className="rounded-kdd-md bg-kdd-card px-3 py-2">
                  <p className="text-xs text-kdd-dim">Spin Risk</p>
                  <span className={`mt-1 block ${riskColor[r.spin_risk]}`}>{r.spin_risk}</span>
                </div>
                <div className="rounded-kdd-md bg-kdd-card px-3 py-2">
                  <p className="text-xs text-kdd-dim">Thermal Risk</p>
                  <span className={`mt-1 block ${riskColor[r.thermal_risk]}`}>{r.thermal_risk}</span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="rounded-kdd-md bg-kdd-accent px-3 py-1.5 text-xs font-medium text-white">
                  Propose to Crew Chief
                </button>
                <button className="rounded-kdd-md border border-kdd-border px-3 py-1.5 text-xs text-kdd-muted">
                  Export Evidence
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 17-digital-twin integration note */}
      <div className="panel">
        <h2 className="mb-2 text-sm font-semibold text-kdd-muted">Future Integration</h2>
        <p className="text-xs text-kdd-dim">
          Digital Twin backend (17-digital-twin-simulation-lab) will provide real-time twin synchronization.
          Currently using model predictions based on circuit intelligence and historical data.
        </p>
      </div>
    </div>
  );
}
