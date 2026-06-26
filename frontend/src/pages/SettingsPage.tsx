import { useState } from "react";
import { clearAuthToken, getAuthToken, setAuthToken } from "../api/client";

export function SettingsPage() {
  const [token, setToken] = useState(() => getAuthToken() ?? "");
  const [savedToken, setSavedToken] = useState(() => getAuthToken() ?? "");

  const handleSave = () => {
    if (!token.trim()) return;
    setAuthToken(token);
    setSavedToken(token.trim());
  };

  const handleClear = () => {
    clearAuthToken();
    setToken("");
    setSavedToken("");
  };

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
          <h2 className="text-sm font-semibold text-zinc-400">Authentication</h2>
          <div>
            <label className="text-xs text-zinc-500">Bearer token</label>
            <textarea
              value={token}
              onChange={(event) => setToken(event.target.value)}
              rows={4}
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:outline-none"
              placeholder="Paste JWT access token here"
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className={savedToken ? "badge-ok" : "badge-neutral"}>{savedToken ? "stored" : "empty"}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500"
                >
                  Save token
                </button>
              </div>
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              Saved token is attached automatically to frontend API requests.
            </p>
          </div>

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
