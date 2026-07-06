import { useState } from "react";
import { FileText, Download } from "lucide-react";
import { post } from "../api/client";
import { useRaceSession } from "../hooks/useRaceSession";
import {
  sessionBadgeLabel,
  getDegradationMessages,
  SESSION_BADGE_CLASSES,
} from "../lib/session-badge";
import { DEGRADATION_MESSAGES } from "../lib/session-degradation";

const REPORT_TYPES = [
  { id: "crew_chief_report", label: "Crew Chief Report", desc: "Post-session operational summary" },
  { id: "setup_change_report", label: "Setup Change Report", desc: "Parameter changes and evidence" },
  { id: "pre_gp_report", label: "Pre-GP Report", desc: "Circuit preparation and risk forecast" },
  { id: "post_session_report", label: "Post-Session Report", desc: "Full session analysis" },
  { id: "paper_evidence_export", label: "Paper Evidence Export", desc: "Scientific evidence package for publication" },
];

type Report = {
  id: string;
  type: string;
  label: string;
  status: "generated";
  created_at: string;
};

export function ReportsPage() {
  const { session, hasPersistedSession } = useRaceSession();
  const [reports, setReports] = useState<Report[]>([]);
  const [generating, setGenerating] = useState<string | null>(null);

  const degradationMessages = getDegradationMessages(
    session.telemetryStatus,
    session.circuitConfidence,
    session.dataSource,
  );

  const generate = async (typeId: string, typeLabel: string) => {
    setGenerating(typeId);
    try {
      const data = await post<{ report_id: string }>("/reports", {
        report_type: typeId,
        session_id: `${session.circuitId}-${session.mode}-${new Date().toISOString().split('T')[0]}`,
        circuit_id: session.circuitId,
        include_evidence: true,
      });
      setReports((r) => [
        { id: data.report_id, type: typeId, label: typeLabel, status: "generated", created_at: new Date().toLocaleTimeString() },
        ...r,
      ]);
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-3">
          <p className="eyebrow">Reports / Debrief</p>
          <span className={SESSION_BADGE_CLASSES}>
            {sessionBadgeLabel(session, hasPersistedSession)}
          </span>
        </div>
        <h1 className="mt-2 text-3xl font-semibold">Report generation & export</h1>
        <p className="mt-2 text-kdd-muted">
          Generate crew chief reports, setup change reports, pre-GP documentation and paper evidence packages.
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-kdd-dim">Session:</span>
          <span className="text-sm text-kdd-text">{session.riderName} · {session.bikeName}</span>
          <span className="text-kdd-dim">·</span>
          <span className="text-sm text-kdd-text">{session.circuitName}</span>
          <span className="text-kdd-dim">·</span>
          <span className="text-sm text-kdd-cyan">{session.mode}</span>
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

      {/* Simulation mode banner */}
      {session.dataSource === "simulation" && (
        <div className="rounded-kdd-md border border-kdd-cyan/40 bg-kdd-cyan-dim px-4 py-2 text-sm text-kdd-cyan">
          {DEGRADATION_MESSAGES.simulationModeReports}
        </div>
      )}

      {/* Session summary */}
      <div className="panel">
        <h2 className="mb-4 text-sm font-semibold text-kdd-muted">Session Summary</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-kdd-dim">Circuit</span>
              <span className="text-sm text-kdd-text">{session.circuitName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-kdd-dim">Rider</span>
              <span className="text-sm text-kdd-text">{session.riderName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-kdd-dim">Bike</span>
              <span className="text-sm text-kdd-text">{session.bikeName}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-kdd-dim">Mode</span>
              <span className="text-sm text-kdd-text">{session.mode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-kdd-dim">Data Source</span>
              <span className="text-sm text-kdd-text">{session.dataSource}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-kdd-dim">Telemetry</span>
              <span className="text-sm text-kdd-text">{session.telemetryStatus}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {REPORT_TYPES.map((rt) => (
          <button
            key={rt.id}
            onClick={() => generate(rt.id, rt.label)}
            disabled={generating === rt.id}
            className="panel text-left hover:border-kdd-border-mid transition-colors disabled:opacity-50 cursor-pointer"
          >
            <FileText className={`h-5 w-5 ${rt.id === "paper_evidence_export" ? "text-kdd-accent" : "text-kdd-muted"}`} />
            <p className="mt-3 font-medium text-sm">{rt.label}</p>
            <p className="mt-1 text-xs text-kdd-dim">{rt.desc}</p>
            <p className="mt-3 text-xs text-kdd-accent">
              {generating === rt.id ? "Generating…" : "Generate →"}
            </p>
          </button>
        ))}
      </div>

      {/* Decision log */}
      <div className="panel">
        <h2 className="mb-4 text-sm font-semibold text-kdd-muted">Decision Log</h2>
        <div className="space-y-3">
          {[
            { time: "14:32", action: "Setup change approved", module: "Crew Chief", risk: "low" },
            { time: "14:15", action: "Tyre strategy adjusted", module: "Race Strategy", risk: "medium" },
            { time: "13:58", action: "Circuit intelligence updated", module: "Circuit Intelligence", risk: "low" },
          ].map((decision, i) => (
            <div key={i} className="flex items-center justify-between rounded-kdd-md bg-kdd-surface px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-kdd-dim">{decision.time}</span>
                <span className="text-sm text-kdd-text">{decision.action}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-kdd-dim">{decision.module}</span>
                <span className={`badge-${decision.risk === "low" ? "ok" : "warn"}`}>{decision.risk}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance deltas */}
      <div className="panel">
        <h2 className="mb-4 text-sm font-semibold text-kdd-muted">Performance Deltas</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-kdd-md bg-kdd-surface p-4">
            <p className="text-xs text-kdd-dim">Lap Time Delta</p>
            <p className="mt-1 text-2xl font-bold text-kdd-green">-0.342s</p>
            <p className="mt-1 text-xs text-kdd-dim">vs. baseline</p>
          </div>
          <div className="rounded-kdd-md bg-kdd-surface p-4">
            <p className="text-xs text-kdd-dim">Sector 2 Improvement</p>
            <p className="mt-1 text-2xl font-bold text-kdd-cyan">-0.187s</p>
            <p className="mt-1 text-xs text-kdd-dim">braking zone optimized</p>
          </div>
          <div className="rounded-kdd-md bg-kdd-surface p-4">
            <p className="text-xs text-kdd-dim">Tyre Life Extension</p>
            <p className="mt-1 text-2xl font-bold text-kdd-yellow">+3 laps</p>
            <p className="mt-1 text-xs text-kdd-dim">rear compound</p>
          </div>
        </div>
      </div>

      {/* Evidence pack */}
      <div className="panel">
        <h2 className="mb-4 text-sm font-semibold text-kdd-muted">Evidence Pack Status</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { module: "Telemetry", status: session.telemetryStatus, ready: session.telemetryStatus === "ready" },
            { module: "Circuit Intelligence", status: `${session.circuitConfidence}% confidence`, ready: session.circuitConfidence >= 80 },
            { module: "Tyre Data", status: "Available", ready: true },
            { module: "Setup History", status: "Available", ready: true },
          ].map((item) => (
            <div key={item.module} className="flex items-center justify-between rounded-kdd-md bg-kdd-surface px-4 py-3">
              <span className="text-sm text-kdd-text">{item.module}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-kdd-dim">{item.status}</span>
                <span className={item.ready ? "badge-ok" : "badge-warn"}>
                  {item.ready ? "ready" : "pending"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {reports.length > 0 && (
        <div className="panel space-y-3">
          <h2 className="text-sm font-semibold text-kdd-muted">Generated Reports</h2>
          {reports.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-kdd-md border border-kdd-border px-4 py-3">
              <div>
                <p className="text-sm font-medium">{r.label}</p>
                <p className="text-xs text-kdd-dim">{r.id} · {r.created_at}</p>
              </div>
              <div className="flex gap-2">
                <span className="badge-ok">generated</span>
                <button className="flex items-center gap-1 rounded-kdd-md border border-kdd-border px-2.5 py-1 text-xs text-kdd-muted hover:text-kdd-text">
                  <Download className="h-3 w-3" />
                  Export
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Copilot-ready summary */}
      <div className="panel">
        <h2 className="mb-4 text-sm font-semibold text-kdd-muted">Copilot-Ready Summary</h2>
        <div className="rounded-kdd-md bg-kdd-surface p-4">
          <p className="text-sm text-kdd-text">
            Session {session.mode} at {session.circuitName} with {session.riderName} on {session.bikeName}.
            {session.telemetryStatus === "ready" 
              ? " Live telemetry available for real-time analysis."
              : " Telemetry data is limited — using model predictions."}
            {session.circuitConfidence >= 80 
              ? " Circuit intelligence is high confidence."
              : " Circuit confidence is below threshold — verify predictions."}
          </p>
        </div>
      </div>

      {/* Next session plan */}
      <div className="panel">
        <h2 className="mb-4 text-sm font-semibold text-kdd-muted">Next Session Plan</h2>
        <div className="space-y-2">
          {[
            "Review tyre degradation from current session",
            "Adjust setup based on performance deltas",
            "Brief crew on strategy for next session",
            "Update circuit intelligence with new data",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 rounded-kdd-md bg-kdd-surface px-4 py-2">
              <span className="text-xs text-kdd-dim">{i + 1}.</span>
              <span className="text-sm text-kdd-text">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Export-ready layout */}
      <div className="panel">
        <h2 className="mb-4 text-sm font-semibold text-kdd-muted">Export Structure</h2>
        <div className="rounded-kdd-md bg-kdd-surface p-4">
          <div className="space-y-2 text-xs text-kdd-dim">
            <p>📄 Executive Summary</p>
            <p>📊 Performance Metrics</p>
            <p>🔧 Setup Configuration</p>
            <p>📈 Telemetry Analysis</p>
            <p>🗺️ Circuit Intelligence</p>
            <p>🛞 Tyre Strategy</p>
            <p>⚠️ Risk Assessment</p>
            <p>📋 Recommendations</p>
          </div>
        </div>
      </div>

      <div className="panel">
        <h2 className="mb-4 text-sm font-semibold text-kdd-muted">Paper Evidence Coverage</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-kdd-border">
              <th className="pb-2 text-left text-xs text-kdd-dim font-medium">Claim</th>
              <th className="pb-2 text-left text-xs text-kdd-dim font-medium">Module</th>
              <th className="pb-2 text-left text-xs text-kdd-dim font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Hessian-aware PTQ enables edge LLM deployment", "Edge AI", "ready"],
              ["FoSdig and IPW certify operating point", "Edge AI", "ready"],
              ["1M+ telemetry points/s require streaming-native design", "Live Telemetry", "simulated"],
              ["MAS avoids context dilution", "AI Copilot", "ready"],
              ["SDD governs autonomous code changes", "Crew Chief", "ready"],
              ["RNN-PINN/UKF-M predicts constrained dynamics", "Digital Twin", "prototype"],
              ["KDD governs decision patterns", "Setup Management", "ready"],
            ].map(([claim, module, status]) => (
              <tr key={claim} className="border-b border-kdd-border/50">
                <td className="py-2 text-kdd-text pr-4">{claim}</td>
                <td className="py-2 text-kdd-dim pr-4">{module}</td>
                <td className="py-2">
                  <span className={status === "ready" ? "badge-ok" : status === "prototype" ? "badge-warn" : "badge-neutral"}>
                    {status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
