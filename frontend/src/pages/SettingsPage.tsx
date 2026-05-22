export function SettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold">System configuration</h1>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel space-y-4">
          <h2 className="text-sm font-semibold text-zinc-400">Service Endpoints</h2>
          {[
            ["Backend API", "http://localhost:8150"],
            ["KDD Pipelines", "http://localhost:8060"],
            ["AI Copilot", "http://localhost:8160"],
            ["Digital Twin", "http://localhost:8170"],
            ["Documentation Agent", "http://localhost:8040"],
          ].map(([name, url]) => (
            <div key={name}>
              <label className="text-xs text-zinc-500">{name}</label>
              <input
                defaultValue={url}
                className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:outline-none"
              />
            </div>
          ))}
        </div>

        <div className="panel space-y-4">
          <h2 className="text-sm font-semibold text-zinc-400">Feature Flags</h2>
          {[
            ["Mock Mode", true],
            ["Live Telemetry", true],
            ["AI Copilot", true],
            ["Digital Twin", true],
            ["Parts Module", true],
            ["Paper Evidence Export", true],
          ].map(([name, enabled]) => (
            <div key={String(name)} className="flex items-center justify-between">
              <span className="text-sm text-zinc-300">{String(name)}</span>
              <span className={enabled ? "badge-ok" : "badge-neutral"}>{enabled ? "enabled" : "disabled"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
