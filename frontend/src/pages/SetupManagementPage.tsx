import { useState } from "react";

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
  const [view, setView] = useState<"diff" | "baseline" | "proposed">("diff");

  const changes = rows.filter((r) => String(BASELINE[r.key]) !== String(PROPOSED[r.key]));

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Setup Management</p>
        <h1 className="mt-2 text-3xl font-semibold">Setup comparison & tracking</h1>
        <p className="mt-2 text-zinc-400">
          Compare baseline vs proposed · Track changes · Evidence-backed approval
        </p>
      </header>

      <div className="flex gap-2">
        {(["diff", "baseline", "proposed"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              view === v ? "bg-red-600 text-white" : "border border-zinc-700 text-zinc-400 hover:text-zinc-100"
            }`}
          >
            {v === "diff" ? "Show Diff" : v === "baseline" ? "Baseline" : "Proposed"}
          </button>
        ))}
      </div>

      <div className="panel overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                Parameter
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                Baseline
              </th>
              {view !== "baseline" && (
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Proposed
                </th>
              )}
              {view === "diff" && (
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
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
                  className={`border-b border-zinc-800/50 ${changed && view === "diff" ? "bg-amber-950/10" : ""}`}
                >
                  <td className="px-4 py-3 text-zinc-300">{label}</td>
                  <td className="px-4 py-3 font-mono text-zinc-400">
                    {bval}{unit && ` ${unit}`}
                  </td>
                  {view !== "baseline" && (
                    <td className={`px-4 py-3 font-mono ${changed ? "text-amber-400 font-semibold" : "text-zinc-400"}`}>
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
                <td colSpan={4} className="px-4 py-6 text-center text-zinc-500">
                  No differences found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {view === "diff" && (
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
          <span className="text-sm text-zinc-400">
            {changes.length} parameter{changes.length !== 1 ? "s" : ""} changed · Risk: medium
          </span>
          <div className="flex gap-2">
            <button type="button" className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:text-white">
              Request Simulation
            </button>
            <button type="button" className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white">
              Propose to Crew Chief
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
