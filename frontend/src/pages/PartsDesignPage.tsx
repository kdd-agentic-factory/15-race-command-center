import { useState } from "react";

type PartStatus = "concept" | "designed" | "simulated" | "approved_for_manufacturing" | "manufactured" | "mounted" | "tested" | "rejected" | "archived";

const LIFECYCLE: PartStatus[] = ["concept", "designed", "simulated", "approved_for_manufacturing", "manufactured", "mounted", "tested"];

const parts = [
  {
    id: "part-brake-jerez",
    name: "Brake Duct Jerez V1",
    type: "Cooling",
    circuit: "Jerez",
    status: "designed" as PartStatus,
    risk: "low",
    impact: "Stable brake pressure and reduced fade risk in long braking zones.",
    material: "PA12_CF",
    weight: "142g",
    problem: "Front brake overheating under repeated heavy braking at T1 and T5.",
    hypothesis: "Increased airflow through modified duct reduces brake temperature by 15°C.",
  },
  {
    id: "part-tire-duct",
    name: "Rear Tire Cooling Duct",
    type: "Thermal Management",
    circuit: "Jerez",
    status: "simulated" as PartStatus,
    risk: "medium",
    impact: "Reduce rear carcass temperature drift in long drive phases.",
    material: "Carbon fiber composite",
    weight: "85g",
    problem: "Rear carcass temperature drift in long drive phases causes spin.",
    hypothesis: "Directed airflow reduces carcass temperature accumulation.",
  },
  {
    id: "part-deflector-mugello",
    name: "Low-Drag Side Deflector",
    type: "Aerodynamic",
    circuit: "Mugello",
    status: "concept" as PartStatus,
    risk: "high",
    impact: "Improve high-speed stability with minimal drag penalty.",
    material: "TBD",
    weight: "TBD",
    problem: "High-speed instability on Mugello straight causes rider confidence loss.",
    hypothesis: "Shaped deflector reduces drag while adding lateral stability.",
  },
];

const riskClass: Record<string, string> = {
  low: "badge-ok",
  medium: "badge-warn",
  high: "badge-danger",
};

export function PartsDesignPage() {
  const [selected, setSelected] = useState(parts[0]);

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Circuit-Specific Parts</p>
        <h1 className="mt-2 text-3xl font-semibold">Parts design & validation</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Manage circuit-specific components from concept to simulation, approval, manufacturing, mounting and post-session validation.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {parts.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p)}
            className={`rounded-2xl border p-5 text-left transition-colors ${
              selected.id === p.id
                ? "border-red-600 bg-red-950/20"
                : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{p.name}</h2>
                <p className="mt-0.5 text-xs text-zinc-500">{p.type}</p>
              </div>
              <span className="badge-neutral shrink-0">{p.status}</span>
            </div>
            <p className="mt-3 text-xs text-zinc-500">Target: {p.circuit}</p>
            <p className="mt-2 text-sm text-zinc-300 line-clamp-2">{p.impact}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className={riskClass[p.risk]}>risk: {p.risk}</span>
              <span className="text-xs text-zinc-600">{p.material}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="panel space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">{selected.name}</h2>
            <p className="mt-0.5 text-sm text-zinc-500">{selected.type} · {selected.circuit}</p>
          </div>
          <div className="flex gap-2">
            <span className={riskClass[selected.risk]}>risk: {selected.risk}</span>
            <span className="badge-neutral">{selected.status}</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Problem</p>
            <p className="mt-1 text-sm text-zinc-300">{selected.problem}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Technical Hypothesis</p>
            <p className="mt-1 text-sm text-zinc-300">{selected.hypothesis}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Expected Impact</p>
            <p className="mt-1 text-sm text-zinc-300">{selected.impact}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Material / Weight</p>
            <p className="mt-1 text-sm text-zinc-300">{selected.material} · {selected.weight}</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white">
            Request Simulation
          </button>
          <button className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:text-white">
            Advance Status
          </button>
          <button className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:text-white">
            View Evidence
          </button>
        </div>
      </div>

      <div className="panel">
        <h2 className="mb-4 text-sm font-semibold text-zinc-400">Part Lifecycle</h2>
        <div className="flex gap-1.5 flex-wrap">
          {LIFECYCLE.map((step, i) => {
            const activeIdx = LIFECYCLE.indexOf(selected.status);
            const isPast = i < activeIdx;
            const isCurrent = i === activeIdx;
            return (
              <div
                key={step}
                className={`flex-1 min-w-[90px] rounded-lg border px-2 py-2 text-center text-xs capitalize transition-colors ${
                  isCurrent
                    ? "border-red-600 bg-red-950/30 text-red-300 font-semibold"
                    : isPast
                    ? "border-zinc-700 bg-zinc-900 text-zinc-400"
                    : "border-zinc-800 bg-zinc-950 text-zinc-600"
                }`}
              >
                {step.replace(/_/g, " ")}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
