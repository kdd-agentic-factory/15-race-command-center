import { useState } from "react";
import { clearAuthToken, getAuthToken, setAuthToken } from "../api/client";

const ENDPOINTS_KEY = "rcc_endpoints";

const DEFAULT_ENDPOINTS: Record<string, string> = {
  "Backend API": "http://localhost:8150",
  "KDD Pipelines": "http://localhost:8060",
  "AI Copilot": "http://localhost:8160",
  "Digital Twin": "http://localhost:8170",
  "Documentation Agent": "http://localhost:8040",
};

function loadEndpoints(): Record<string, string> {
  try {
    const stored = localStorage.getItem(ENDPOINTS_KEY);
    return stored ? { ...DEFAULT_ENDPOINTS, ...JSON.parse(stored) } : { ...DEFAULT_ENDPOINTS };
  } catch {
    return { ...DEFAULT_ENDPOINTS };
  }
}

function saveEndpoints(endpoints: Record<string, string>) {
  localStorage.setItem(ENDPOINTS_KEY, JSON.stringify(endpoints));
}

export function SettingsPage() {
  const [token, setToken] = useState(() => getAuthToken() ?? "");
  const [savedToken, setSavedToken] = useState(() => getAuthToken() ?? "");
  const [endpoints, setEndpoints] = useState<Record<string, string>>(loadEndpoints);
  const [endpointsSaved, setEndpointsSaved] = useState(false);

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

  const handleEndpointChange = (name: string, value: string) => {
    setEndpoints((prev) => ({ ...prev, [name]: value }));
    setEndpointsSaved(false);
  };

  const handleSaveEndpoints = () => {
    saveEndpoints(endpoints);
    setEndpointsSaved(true);
    setTimeout(() => setEndpointsSaved(false), 2000);
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
          {Object.entries(endpoints).map(([name, url]) => (
            <div key={name}>
              <label className="text-xs text-zinc-500">{name}</label>
              <input
                value={url}
                onChange={(e) => handleEndpointChange(name, e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:outline-none"
              />
            </div>
          ))}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveEndpoints}
              className="rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500"
            >
              Save endpoints
            </button>
            {endpointsSaved && <span className="badge-ok">saved</span>}
          </div>
          <p className="text-xs text-zinc-500">
            Endpoint changes affect API requests from this browser. Paste the full base URL (e.g. https://api.example.com).
          </p>
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
