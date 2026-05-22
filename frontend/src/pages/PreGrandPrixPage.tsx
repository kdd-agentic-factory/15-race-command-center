export function PreGrandPrixPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Pre-Grand Prix</p>
        <h1 className="mt-2 text-3xl font-semibold">Circuit preparation workspace</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Prepare the race weekend using circuit profile, historical telemetry, baseline setup,
          part candidates, simulation plans and crew chief notes.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel">
          <p className="eyebrow mb-3">Circuit Profile</p>
          <h2 className="text-lg font-semibold">Jerez · Spain</h2>
          <div className="mt-3 space-y-2 text-sm">
            {[
              ["Braking demand", "High"],
              ["Traction demand", "Medium"],
              ["Surface abrasion", "High"],
              ["Length", "4.423 km"],
              ["Corners", "13"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-zinc-500">{k}</span>
                <span className="text-zinc-200">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow mb-3">Weather Forecast</p>
          <h2 className="text-lg font-semibold">Sunny · 42°C track</h2>
          <div className="mt-3 space-y-2 text-sm">
            {[
              ["Air temp", "28°C"],
              ["Track temp", "42°C"],
              ["Humidity", "35%"],
              ["Wind", "12 km/h NE"],
              ["Condition", "Clear"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-zinc-500">{k}</span>
                <span className="text-zinc-200">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow mb-3">Risk Forecast</p>
          <div className="space-y-3">
            {[
              { area: "Tire degradation", risk: "high" },
              { area: "Front brake thermal", risk: "medium" },
              { area: "Rear spin", risk: "medium" },
              { area: "High-speed stability", risk: "low" },
              { area: "Rear instability", risk: "low" },
            ].map(({ area, risk }) => (
              <div key={area} className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">{area}</span>
                <span className={
                  risk === "high" ? "badge-danger" : risk === "medium" ? "badge-warn" : "badge-ok"
                }>{risk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <h2 className="mb-4 text-lg font-semibold">Baseline Setup</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Engine Map", "map-1"],
            ["TC Map", "tc-3"],
            ["Rear Compound", "soft"],
            ["Aero Package", "A"],
            ["Rear Preload", "14 clicks"],
            ["Front Compound", "medium"],
            ["Rear Pressure", "1.85 bar"],
            ["Anti-Wheelie", "aw-2"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-zinc-900 px-3 py-3">
              <p className="text-xs text-zinc-500">{k}</p>
              <p className="mt-1 font-medium text-sm">{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2 className="mb-4 text-lg font-semibold">FP1 Run Plan</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { run: 1, obj: "Baseline validation", laps: 8, compound: "medium/soft", notes: "Establish reference lap" },
            { run: 2, obj: "Rear grip comparison", laps: 6, compound: "soft/soft", notes: "Evaluate brake duct V1" },
            { run: 3, obj: "Engine Map 2 what-if", laps: 5, compound: "soft/soft", notes: "Compare spin ratio at T13" },
          ].map(({ run, obj, laps, compound, notes }) => (
            <div key={run} className="rounded-xl bg-zinc-900 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Run {run}</span>
                <span className="text-xs text-zinc-600">{laps} laps</span>
              </div>
              <p className="mt-2 font-medium text-sm">{obj}</p>
              <p className="mt-1 text-xs text-zinc-500">{compound}</p>
              <p className="mt-2 text-xs text-zinc-400">{notes}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2 className="mb-3 text-lg font-semibold">Part Candidates</h2>
        <div className="space-y-2">
          {[
            { name: "Brake Duct Jerez V1", status: "designed", priority: "high" },
            { name: "Rear Tire Cooling Duct", status: "simulated", priority: "medium" },
          ].map(({ name, status, priority }) => (
            <div key={name} className="flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3">
              <span className="text-sm">{name}</span>
              <div className="flex gap-2">
                <span className="badge-neutral">{status}</span>
                <span className={priority === "high" ? "badge-danger" : "badge-warn"}>{priority}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white">
          Generate Pre-GP Report
        </button>
        <button className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm text-zinc-300 hover:text-white">
          Export FP1 Plan
        </button>
      </div>
    </div>
  );
}
