import { useState } from "react";
import { FileText, Download } from "lucide-react";

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
  const [reports, setReports] = useState<Report[]>([]);
  const [generating, setGenerating] = useState<string | null>(null);

  const generate = async (typeId: string, typeLabel: string) => {
    setGenerating(typeId);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_type: typeId,
          session_id: "jerez-fp2-2026-05-03",
          circuit_id: "jerez",
          include_evidence: true,
        }),
      });
      const data = await res.json();
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
        <p className="eyebrow">Reports & Evidence</p>
        <h1 className="mt-2 text-3xl font-semibold">Report generation & export</h1>
        <p className="mt-2 text-zinc-400">
          Generate crew chief reports, setup change reports, pre-GP documentation and paper evidence packages.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {REPORT_TYPES.map((rt) => (
          <button
            key={rt.id}
            onClick={() => generate(rt.id, rt.label)}
            disabled={generating === rt.id}
            className="panel text-left hover:border-zinc-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <FileText className={`h-5 w-5 ${rt.id === "paper_evidence_export" ? "text-red-500" : "text-zinc-500"}`} />
            <p className="mt-3 font-medium text-sm">{rt.label}</p>
            <p className="mt-1 text-xs text-zinc-500">{rt.desc}</p>
            <p className="mt-3 text-xs text-red-500">
              {generating === rt.id ? "Generating…" : "Generate →"}
            </p>
          </button>
        ))}
      </div>

      {reports.length > 0 && (
        <div className="panel space-y-3">
          <h2 className="text-sm font-semibold text-zinc-400">Generated Reports</h2>
          {reports.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3">
              <div>
                <p className="text-sm font-medium">{r.label}</p>
                <p className="text-xs text-zinc-500">{r.id} · {r.created_at}</p>
              </div>
              <div className="flex gap-2">
                <span className="badge-ok">generated</span>
                <button className="flex items-center gap-1 rounded-lg border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 hover:text-white">
                  <Download className="h-3 w-3" />
                  Export
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="panel">
        <h2 className="mb-4 text-sm font-semibold text-zinc-400">Paper Evidence Coverage</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="pb-2 text-left text-xs text-zinc-500 font-medium">Claim</th>
              <th className="pb-2 text-left text-xs text-zinc-500 font-medium">Module</th>
              <th className="pb-2 text-left text-xs text-zinc-500 font-medium">Status</th>
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
              <tr key={claim} className="border-b border-zinc-800/50">
                <td className="py-2 text-zinc-300 pr-4">{claim}</td>
                <td className="py-2 text-zinc-500 pr-4">{module}</td>
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
