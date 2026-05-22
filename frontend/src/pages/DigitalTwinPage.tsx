import { useState } from "react";

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
  const [form, setForm] = useState({ param: "engine_map", value: "map-2", notes: "" });
  const [results, setResults] = useState<SimResult[]>([]);
  const [loading, setLoading] = useState(false);

  const runSim = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/simulation/what-if", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseline_setup_id: "setup-base-jerez",
          setup_change: { [form.param]: form.value },
          circuit_id: "jerez",
          notes: form.notes,
        }),
      });
      const data = await res.json();
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
        <p className="eyebrow">Digital Twin</p>
        <h1 className="mt-2 text-3xl font-semibold">What-if simulation viewer</h1>
        <p className="mt-2 text-zinc-400">
          Simulate setup changes against the baseline · Estimate lap delta · Assess risk before approval
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel space-y-4">
          <h2 className="text-sm font-semibold text-zinc-400">Run What-If Simulation</h2>

          <div>
            <label className="text-xs text-zinc-500">Baseline Setup</label>
            <p className="mt-1 rounded-xl bg-zinc-900 px-3 py-2 text-sm text-zinc-300">setup-base-jerez</p>
          </div>

          <div>
            <label className="text-xs text-zinc-500">Parameter</label>
            <select
              value={form.param}
              onChange={(e) => setForm({ ...form, param: e.target.value })}
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none"
            >
              {["engine_map", "rear_preload", "rear_rebound", "tc_map", "rear_tire_pressure", "aero_package"].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-zinc-500">Proposed Value</label>
            <input
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none"
              placeholder="e.g. map-2"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-500">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="mt-1 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none"
              placeholder="Optional notes..."
            />
          </div>

          <button
            onClick={runSim}
            disabled={loading}
            className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? "Running simulation…" : "Run What-If"}
          </button>
        </div>

        <div className="panel">
          <h2 className="mb-4 text-sm font-semibold text-zinc-400">Baseline Setup</h2>
          <div className="space-y-2 text-sm">
            {[
              ["Engine Map", "map-1"],
              ["TC Map", "tc-3"],
              ["Rear Preload", "14 clicks"],
              ["Rear Rebound", "18 clicks"],
              ["Rear Pressure", "1.85 bar"],
              ["Rear Compound", "soft"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-zinc-800 pb-1.5">
                <span className="text-zinc-500">{k}</span>
                <span className="font-mono text-zinc-300">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <div className="panel space-y-3">
          <h2 className="text-sm font-semibold text-zinc-400">Simulation Results</h2>
          {results.map((r) => (
            <div key={r.sim_id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-sm">{r.change}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{r.sim_id}</p>
                </div>
                <span className="badge-neutral">{r.status}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <div className="rounded-lg bg-zinc-950 px-3 py-2">
                  <p className="text-xs text-zinc-500">Lap Delta</p>
                  <p className={`mt-0.5 font-bold ${r.lap_delta_ms < 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {r.lap_delta_ms > 0 ? "+" : ""}{r.lap_delta_ms} ms
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-950 px-3 py-2">
                  <p className="text-xs text-zinc-500">Spin Risk</p>
                  <span className={`mt-1 block ${riskColor[r.spin_risk]}`}>{r.spin_risk}</span>
                </div>
                <div className="rounded-lg bg-zinc-950 px-3 py-2">
                  <p className="text-xs text-zinc-500">Thermal Risk</p>
                  <span className={`mt-1 block ${riskColor[r.thermal_risk]}`}>{r.thermal_risk}</span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-medium text-white">
                  Propose to Crew Chief
                </button>
                <button className="rounded-xl border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300">
                  Export Evidence
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
