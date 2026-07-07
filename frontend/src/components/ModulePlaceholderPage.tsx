import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Construction, Sparkles, Eye } from "lucide-react";
import { moduleByRoute } from "../config/raceCommandModules";
import type { ModuleStatus } from "../config/raceCommandModules";

const STATUS_META: Record<ModuleStatus, { label: string; color: string; icon: typeof Sparkles }> = {
  available: { label: "Connected", color: "text-kdd-green", icon: Eye },
  preview: { label: "Preview", color: "text-kdd-yellow", icon: Sparkles },
  "coming-soon": { label: "Coming Soon", color: "text-kdd-dim", icon: Construction },
};

export function ModulePlaceholderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const mod = moduleByRoute(location.pathname);

  if (!mod) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center bg-kdd-bg">
        <Construction className="mb-4 h-12 w-12 text-kdd-dim" />
        <h2 className="text-xl font-semibold">Module Not Found</h2>
        <p className="mt-2 text-sm text-kdd-dim">No registry entry for {location.pathname}</p>
        <button onClick={() => navigate("/overview")} className="mt-6 flex items-center gap-2 rounded-kdd-md bg-kdd-accent px-4 py-2 text-sm font-medium text-white hover:bg-kdd-accent-hover">
          <ArrowLeft className="h-4 w-4" /> Return to Overview
        </button>
      </div>
    );
  }

  const meta = STATUS_META[mod.status];
  const Icon = mod.icon;

  return (
    <div className="min-h-[60vh] space-y-8 bg-kdd-bg">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-kdd-accent" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold">{mod.label}</h1>
                {mod.badge && (
                  <span className={[
                    "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                    mod.badge === "LIVE" ? "bg-kdd-green-dim text-kdd-green" :
                    mod.badge === "10Hz" ? "bg-kdd-cyan-dim text-kdd-cyan" :
                    mod.badge === "PDF" ? "bg-kdd-orange-dim text-kdd-orange" :
                    "bg-kdd-accent-dim text-kdd-accent",
                  ].join(" ")}>
                    {mod.badge}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-kdd-dim">{mod.description}</p>
            </div>
          </div>
        </div>
        <span className={["flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium", 
          mod.status === "available" ? "bg-kdd-green-dim text-kdd-green" :
          mod.status === "preview" ? "bg-kdd-yellow-dim text-kdd-yellow" :
          "bg-[rgba(255,255,255,0.04)] text-kdd-dim",
        ].join(" ")}>
          <meta.icon className="h-3 w-3" />
          {meta.label}
        </span>
      </header>

      {/* Section info */}
      <div className="panel">
        <p className="text-xs font-medium uppercase tracking-widest text-kdd-dim">{mod.section}</p>
        <p className="mt-1 text-sm text-kdd-muted">
          {mod.status === "available"
            ? "This module is connected and available in the current deployment."
            : mod.status === "preview"
              ? "This module is in preview and may have limited functionality."
              : "This module is planned and will be available in a future release."}
        </p>
      </div>

      {/* Placeholder content */}
      <div className="flex flex-col items-center justify-center rounded-kdd-lg border border-dashed border-kdd-border bg-kdd-surface py-20">
        <Construction className="mb-4 h-16 w-16 text-kdd-dim" />
        <h2 className="text-lg font-medium text-kdd-muted">
          {mod.status === "coming-soon" ? "Under Development" : "Preview Module"}
        </h2>
        <p className="mt-1 max-w-md text-center text-sm text-kdd-dim">
          {mod.status === "coming-soon"
            ? `${mod.label} is on the roadmap and will be implemented in a future phase.`
            : `${mod.label} is available in preview mode. Full implementation is in progress.`}
        </p>
      </div>

      {/* Back navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate("/overview")}
          className="flex items-center gap-2 rounded-kdd-md border border-kdd-border px-4 py-2 text-sm text-kdd-muted hover:bg-kdd-hover hover:text-kdd-text"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Overview
        </button>
      </div>
    </div>
  );
}

