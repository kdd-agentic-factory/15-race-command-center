import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface DecisionCardProps {
  title: string;
  recommendation: string;
  impact: string;
  confidence: number;
  urgency: "critical" | "high" | "medium" | "low";
  actionLabel: string;
  onAction?: () => void;
}

const URGENCY_STYLES: Record<string, string> = {
  critical: "border-kdd-red bg-kdd-red-dim/20",
  high: "border-kdd-yellow bg-kdd-yellow-dim/20",
  medium: "border-kdd-cyan bg-kdd-cyan-dim/10",
  low: "border-zinc-700 bg-zinc-800/30",
};

const URGENCY_ICON: Record<string, typeof AlertTriangle> = {
  critical: AlertTriangle,
  high: AlertTriangle,
  medium: Info,
  low: CheckCircle,
};

export function DecisionCard({ title, recommendation, impact, confidence, urgency, actionLabel }: DecisionCardProps) {
  const Icon = URGENCY_ICON[urgency];
  return (
    <div className={`rounded-kdd-lg border-l-4 p-4 ${URGENCY_STYLES[urgency]}`}>
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${
          urgency === "critical" ? "text-kdd-red" :
          urgency === "high" ? "text-kdd-yellow" :
          "text-kdd-cyan"
        }`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-kdd-text">{title}</h3>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              urgency === "critical" ? "bg-kdd-red-dim/30 text-kdd-red" :
              urgency === "high" ? "bg-kdd-yellow-dim/30 text-kdd-yellow" :
              urgency === "medium" ? "bg-kdd-cyan-dim/30 text-kdd-cyan" :
              "bg-zinc-700/30 text-kdd-dim"
            }`}>{urgency}</span>
          </div>
          <p className="mt-1 text-sm text-kdd-muted">{recommendation}</p>
          <p className="mt-1 text-xs text-kdd-dim">Impact: {impact}</p>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-700">
                <div
                  className={`h-full rounded-full transition-all ${
                    confidence >= 80 ? "bg-kdd-green" :
                    confidence >= 50 ? "bg-kdd-yellow" :
                    "bg-kdd-red"
                  }`}
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <span className="font-mono text-xs text-kdd-dim">{confidence}% confidence</span>
            </div>
            <button className="ml-auto rounded-kdd-md bg-kdd-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-kdd-accent-hover">
              {actionLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
