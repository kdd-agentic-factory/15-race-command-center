import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { MetricCard } from "./MetricCard";
import { DecisionCard } from "./DecisionCard";
import { EvidenceList } from "./EvidenceList";
import { RiskConfidenceBar } from "./RiskConfidenceBar";
import { StatusPill } from "./StatusPill";
import { moduleByRoute } from "../../config/raceCommandModules";
import type { ModuleDemoData } from "../../data/rcc-module-demo-data";

interface ModuleDashboardTemplateProps {
  data: ModuleDemoData;
}

export function ModuleDashboardTemplate({ data }: ModuleDashboardTemplateProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const mod = moduleByRoute(location.pathname);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            {mod && <mod.icon className="h-6 w-6 text-kdd-accent" />}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-kdd-text">{mod?.label ?? data.moduleId}</h1>
                <StatusPill
                  label={data.status === "operational" ? "Operational" : data.status === "degraded" ? "Degraded" : "Standby"}
                  variant={data.status === "operational" ? "success" : data.status === "degraded" ? "warning" : "info"}
                />
              </div>
              <p className="mt-1 max-w-2xl text-sm text-kdd-dim">{data.summary}</p>
            </div>
          </div>
        </div>
        <span className="rounded-full bg-kdd-yellow-dim/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-kdd-yellow">
          Preview
        </span>
      </header>

      {/* Metrics Grid */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((m, i) => (
          <MetricCard key={i} {...m} />
        ))}
      </div>

      {/* Decision + Evidence */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DecisionCard {...data.decision} />
        </div>
        <div className="space-y-3">
          <EvidenceList items={data.evidence} />
        </div>
      </div>

      {/* Risk / Confidence */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="panel space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-kdd-dim">Risk Assessment</h2>
          {data.risks.map((r, i) => (
            <RiskConfidenceBar key={i} label={r.label} value={r.value} variant="risk" />
          ))}
        </div>
        <div className="panel space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-kdd-dim">Decision Confidence</h2>
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 flex-shrink-0">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                <circle cx="36" cy="36" r="32" fill="none"
                  stroke={data.confidence >= 80 ? "#22c55e" : data.confidence >= 50 ? "#eab308" : "#ef4444"}
                  strokeWidth="4" strokeDasharray={`${(data.confidence / 100) * 201} 201`}
                  strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-mono text-xl font-bold text-kdd-text">
                {data.confidence}%
              </span>
            </div>
            <div className="text-sm text-kdd-dim">
              <p>Model confidence score based on {data.evidence.length} evidence sources and historical accuracy.</p>
              <p className="mt-2 flex items-center gap-1 text-kdd-green">
                <span className="h-1.5 w-1.5 rounded-full bg-kdd-green" />
                Threshold: 70% for auto-deploy
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Actions */}
      <div className="panel">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-kdd-dim">Next Actions</h2>
        <div className="divide-y divide-kdd-border/50">
          {data.nextActions.map((a, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-kdd-text">{a.label}</p>
                <p className="text-xs text-kdd-dim">{a.description}</p>
              </div>
              <button className="flex-shrink-0 rounded-kdd-md bg-kdd-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-kdd-accent-hover">
                {a.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Back nav */}
      <div className="flex gap-3">
        <button onClick={() => navigate("/overview")}
          className="flex items-center gap-2 rounded-kdd-md border border-kdd-border px-4 py-2 text-sm text-kdd-muted hover:bg-kdd-hover hover:text-kdd-text">
          <ArrowLeft className="h-4 w-4" /> Return to Overview
        </button>
      </div>
    </div>
  );
}
