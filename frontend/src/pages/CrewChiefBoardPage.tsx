import { useState } from "react";

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

export function CrewChiefBoardPage() {
  const [decisions, setDecisions] = useState<Decision[]>(initial);
  const [expanded, setExpanded] = useState<string | null>(null);

  const update = (id: string, status: DecisionStatus) => {
    setDecisions((d) => d.map((dec) => (dec.id === id ? { ...dec, status } : dec)));
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Crew Chief</p>
        <h1 className="mt-2 text-3xl font-semibold">Decision board</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Review AI-assisted recommendations, evidence, simulations and risk before approving
          operational changes.
        </p>
      </header>

      <div className="flex gap-4 text-sm">
        <div className="panel flex-1 text-center">
          <p className="text-zinc-500">Pending Review</p>
          <p className="mt-1 text-3xl font-bold text-amber-400">
            {decisions.filter((d) => d.status === "crew_chief_review").length}
          </p>
        </div>
        <div className="panel flex-1 text-center">
          <p className="text-zinc-500">Simulation Done</p>
          <p className="mt-1 text-3xl font-bold text-blue-400">
            {decisions.filter((d) => d.status === "simulation_completed").length}
          </p>
        </div>
        <div className="panel flex-1 text-center">
          <p className="text-zinc-500">Approved</p>
          <p className="mt-1 text-3xl font-bold text-emerald-400">
            {decisions.filter((d) => d.status === "approved").length}
          </p>
        </div>
        <div className="panel flex-1 text-center">
          <p className="text-zinc-500">Rejected</p>
          <p className="mt-1 text-3xl font-bold text-zinc-500">
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
                <p className="mt-1 text-sm text-zinc-400">{dec.evidence}</p>
                {dec.simulation && (
                  <p className="mt-1 text-xs text-zinc-500">Simulation: {dec.simulation}</p>
                )}
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <span className="badge-neutral capitalize">{dec.status.replace(/_/g, " ")}</span>
                <span className={riskColor[dec.risk]}>risk: {dec.risk}</span>
              </div>
            </div>

            <div
              className="cursor-pointer text-xs text-zinc-600 underline"
              onClick={() => setExpanded(expanded === dec.id ? null : dec.id)}
            >
              {expanded === dec.id ? "Hide evidence" : "View evidence"}
            </div>

            {expanded === dec.id && (
              <div className="rounded-xl bg-zinc-900 p-3 text-xs space-y-1">
                <p className="text-zinc-400"><strong>Source:</strong> telemetry-session-api · confidence 0.91</p>
                <p className="text-zinc-400"><strong>Pattern:</strong> tire_degradation · lap 9 · confidence 0.87</p>
                <p className="text-zinc-400"><strong>Workflow:</strong> wf-fp2-jerez-2026</p>
              </div>
            )}

            {dec.status !== "approved" && dec.status !== "rejected" && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => update(dec.id, "approved")}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white"
                >
                  Approve
                </button>
                <button
                  onClick={() => update(dec.id, "rejected")}
                  className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:text-white"
                >
                  Reject
                </button>
                {!dec.simulation && (
                  <button
                    onClick={() => update(dec.id, "simulation_completed")}
                    className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:text-white"
                  >
                    Request Simulation
                  </button>
                )}
                <button className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:text-white">
                  Generate Report
                </button>
              </div>
            )}

            {(dec.status === "approved" || dec.status === "rejected") && (
              <p className="text-sm font-medium capitalize" style={{ color: dec.status === "approved" ? "#4ade80" : "#f87171" }}>
                {dec.status} by crew chief
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
