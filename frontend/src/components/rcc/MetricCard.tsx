import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: LucideIcon;
  accent?: "neutral" | "positive" | "warning" | "critical";
  trend?: "up" | "down" | "stable";
  className?: string;
}

const ACCENT_STYLES: Record<string, string> = {
  critical: "border-l-kdd-red",
  warning: "border-l-kdd-yellow",
  positive: "border-l-kdd-green",
  neutral: "border-l-kdd-cyan",
};

const TREND_ICONS: Record<string, string> = {
  up: "\u2191",
  down: "\u2193",
  stable: "\u2192",
};

export function MetricCard({ label, value, sub, icon: Icon, accent = "neutral", trend, className = "" }: MetricCardProps) {
  return (
    <div className={`panel border-l-2 ${ACCENT_STYLES[accent]} ${className}`}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-kdd-dim">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-kdd-muted" />}
      </div>
      <p className="mt-1 font-mono text-2xl font-semibold tracking-tight text-kdd-text">
        {value}
        {trend && (
          <span className={`ml-1.5 text-sm ${
            trend === "up" ? "text-kdd-red" : trend === "down" ? "text-kdd-green" : "text-kdd-dim"
          }`}>
            {TREND_ICONS[trend]}
          </span>
        )}
      </p>
      {sub && <p className="mt-0.5 text-xs text-kdd-dim">{sub}</p>}
    </div>
  );
}
