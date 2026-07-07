import { Outlet, useLocation } from "react-router-dom";
import { getAuthToken } from "../api/client";
import { KeyRound, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { setAuthToken } from "../api/client";

/**
 * Auth guard for protected routes.
 * If no token is found, renders a login card INLINE rather than
 * redirecting — this prevents redirect loops (settings → settings)
 * and avoids black screens.
 */
const IS_PREVIEW_MODE = import.meta.env.VITE_RCC_PREVIEW_MODE === "true";

export function ProtectedRoute() {
  const token = getAuthToken();
  const location = useLocation();
  const [inputToken, setInputToken] = useState("");
  const [showLogin, setShowLogin] = useState(!token);

  const handleLogin = () => {
    if (!inputToken.trim()) return;
    setAuthToken(inputToken);
    setShowLogin(false);
  };

  /* ── Preview mode: skip auth block, render children ── */
  if (IS_PREVIEW_MODE) {
    return <Outlet />;
  }

  if (showLogin) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-kdd-xl border border-kdd-border bg-kdd-card p-8 text-center">
          <KeyRound className="mx-auto mb-4 h-10 w-10 text-kdd-accent" />
          <h2 className="mb-2 text-xl font-semibold text-kdd-text">Authentication Required</h2>
          <p className="mb-6 text-sm text-kdd-dim">
            Enter your API token to access <span className="font-mono text-kdd-muted">{location.pathname}</span>
          </p>
          <input
            type="password"
            placeholder="Paste your token..."
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="mb-4 w-full rounded-kdd-md border border-kdd-border bg-kdd-bg px-4 py-2.5 text-sm text-kdd-text placeholder:text-kdd-dim focus:border-kdd-accent focus:outline-none"
          />
          <button
            onClick={handleLogin}
            disabled={!inputToken.trim()}
            className="w-full rounded-kdd-md bg-kdd-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-kdd-accent-hover disabled:opacity-50"
          >
            Authenticate
          </button>
          <a
            href="/"
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-kdd-dim hover:text-kdd-muted"
          >
            <ArrowLeft className="h-3 w-3" /> Return to public overview
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
