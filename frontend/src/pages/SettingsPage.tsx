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
    <div className="space-y-6 bg-kdd-bg text-kdd-text">
      <header className="rounded-kdd-lg border border-kdd-border bg-kdd-card p-5 shadow-kdd-sm">
        <p className="font-kdd-mono text-[10px] font-bold uppercase tracking-[0.24em] text-kdd-cyan">Settings</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-kdd-text">System configuration</h1>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-kdd-lg border border-kdd-border bg-kdd-card p-5 space-y-4">
          <h2 className="font-kdd-mono text-[10px] font-bold uppercase tracking-[0.22em] text-kdd-muted">Service Endpoints</h2>
          {Object.entries(endpoints).map(([name, url]) => (
            <div key={name}>
              <label className="text-xs text-kdd-dim">{name}</label>
              <input
                value={url}
                onChange={(e) => handleEndpointChange(name, e.target.value)}
                className="mt-1 w-full rounded-kdd-md border border-kdd-border bg-kdd-surface px-3 py-2 text-sm text-kdd-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-accent"
              />
            </div>
          ))}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveEndpoints}
              className="min-h-[44px] rounded-kdd-md bg-kdd-accent px-4 py-2 text-sm font-bold text-white transition-colors duration-kdd-fast hover:bg-kdd-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-accent"
            >
              Save endpoints
            </button>
            {endpointsSaved && <span className="rounded-kdd-pill border border-kdd-green/40 bg-kdd-green-dim px-3 py-1 font-kdd-mono text-[10px] text-kdd-green">saved</span>}
          </div>
          <p className="text-xs text-kdd-dim">
            Endpoint changes affect API requests from this browser. Paste the full base URL (e.g. https://api.example.com).
          </p>
        </div>

        <div className="rounded-kdd-lg border border-kdd-border bg-kdd-card p-5 space-y-4">
          <h2 className="font-kdd-mono text-[10px] font-bold uppercase tracking-[0.22em] text-kdd-muted">Authentication</h2>
          <div>
            <label className="text-xs text-kdd-dim">Bearer token</label>
            <textarea
              value={token}
              onChange={(event) => setToken(event.target.value)}
              rows={4}
              className="mt-1 w-full rounded-kdd-md border border-kdd-border bg-kdd-surface px-3 py-2 text-sm text-kdd-text placeholder:text-kdd-dim focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-accent"
              placeholder="Paste JWT access token here"
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className={savedToken ? "rounded-kdd-pill border border-kdd-green/40 bg-kdd-green-dim px-3 py-1 font-kdd-mono text-[10px] text-kdd-green" : "rounded-kdd-pill border border-kdd-border bg-kdd-surface px-3 py-1 font-kdd-mono text-[10px] text-kdd-dim"}>{savedToken ? "stored" : "empty"}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="min-h-[44px] rounded-kdd-md border border-kdd-border bg-kdd-surface px-4 py-2 text-sm text-kdd-muted transition-colors duration-kdd-fast hover:bg-kdd-hover hover:text-kdd-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-accent"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="min-h-[44px] rounded-kdd-md bg-kdd-accent px-4 py-2 text-sm font-bold text-white transition-colors duration-kdd-fast hover:bg-kdd-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-accent"
                >
                  Save token
                </button>
              </div>
            </div>
            <p className="mt-2 text-xs text-kdd-dim">
              Saved token is attached automatically to frontend API requests.
            </p>
          </div>

          <h2 className="font-kdd-mono text-[10px] font-bold uppercase tracking-[0.22em] text-kdd-muted">Feature Flags</h2>
          {[
            ["Mock Mode", true],
            ["Live Telemetry", true],
            ["AI Copilot", true],
            ["Digital Twin", true],
            ["Parts Module", true],
            ["Paper Evidence Export", true],
          ].map(([name, enabled]) => (
            <div key={String(name)} className="flex items-center justify-between">
              <span className="text-sm text-kdd-text">{String(name)}</span>
              <span className={enabled ? "rounded-kdd-pill border border-kdd-green/40 bg-kdd-green-dim px-3 py-1 font-kdd-mono text-[10px] text-kdd-green" : "rounded-kdd-pill border border-kdd-border bg-kdd-surface px-3 py-1 font-kdd-mono text-[10px] text-kdd-dim"}>{enabled ? "enabled" : "disabled"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
