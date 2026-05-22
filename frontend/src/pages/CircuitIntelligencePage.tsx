import { useState } from "react";

const corners = [
  { id: "T1", name: "Turn 1", type: "Heavy Braking", entrySpeed: 250, minSpeed: 80, lean: 58, risk: "high", spinRisk: "medium", timeLost: 0.24, recommendations: ["Monitor front brake temperature", "Check spin on exit"] },
  { id: "T3", name: "Turn 3", type: "Technical", entrySpeed: 160, minSpeed: 72, lean: 55, risk: "medium", spinRisk: "low", timeLost: 0.08, recommendations: [] },
  { id: "T5", name: "Turn 5 (Sito Pons)", type: "Technical", entrySpeed: 180, minSpeed: 72, lean: 62, risk: "medium", spinRisk: "medium", timeLost: 0.15, recommendations: ["Lean angle near limit"] },
  { id: "T6", name: "Turn 6", type: "Flowing", entrySpeed: 145, minSpeed: 90, lean: 48, risk: "low", spinRisk: "low", timeLost: 0.04, recommendations: [] },
  { id: "T13", name: "Turn 13 (Peluqui)", type: "Long Sweep", entrySpeed: 160, minSpeed: 68, lean: 60, risk: "high", spinRisk: "high", timeLost: 0.38, recommendations: ["Critical spin zone in drive phase", "Engine Map 2 recommended"] },
];

const riskColor: Record<string, string> = {
  low: "badge-ok",
  medium: "badge-warn",
  high: "badge-danger",
  critical: "badge-danger",
};

export function CircuitIntelligencePage() {
  const [selected, setSelected] = useState(corners[0]);

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Circuit Intelligence</p>
        <h1 className="mt-2 text-3xl font-semibold">Corner microsegmentation</h1>
        <p className="mt-2 text-zinc-400">Jerez · 13 corners · Sector analysis · Risk overlay</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Corners</h2>
          {corners.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className={`w-full rounded-xl border p-3 text-left transition-colors ${
                selected.id === c.id
                  ? "border-red-600 bg-red-950/30"
                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{c.id} · {c.name}</span>
                <span className={riskColor[c.risk]}>{c.risk}</span>
              </div>
              <div className="mt-1 flex gap-3 text-xs text-zinc-500">
                <span>entry {c.entrySpeed} km/h</span>
                <span>−{c.timeLost.toFixed(2)}s</span>
              </div>
            </button>
          ))}
        </div>

        <div className="panel space-y-4 lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">{selected.id} · {selected.name}</h2>
              <p className="mt-1 text-sm text-zinc-500">{selected.type}</p>
            </div>
            <span className={riskColor[selected.risk]}>{selected.risk} risk</span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Entry Speed", `${selected.entrySpeed} km/h`],
              ["Min Speed", `${selected.minSpeed} km/h`],
              ["Lean Angle", `${selected.lean}°`],
              ["Time Lost", `${selected.timeLost.toFixed(2)}s`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-zinc-900 p-3 text-center">
                <p className="text-xs text-zinc-500">{label}</p>
                <p className="mt-1 font-semibold">{value}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-sm text-zinc-500 mb-2">Spin Risk</p>
            <span className={riskColor[selected.spinRisk]}>{selected.spinRisk}</span>
          </div>

          {selected.recommendations.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-zinc-400 mb-2">Recommendations</p>
              <ul className="space-y-1.5">
                {selected.recommendations.map((r) => (
                  <li key={r} className="flex items-center gap-2 text-sm text-zinc-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
