interface RiskConfidenceBarProps {
  label: string;
  value: string | number;
  variant?: "risk" | "confidence";
  className?: string;
}

export function RiskConfidenceBar({ label, value, variant = "confidence", className = "" }: RiskConfidenceBarProps) {
  const numValue = typeof value === "string" ? parseInt(value, 10) || 0 : value;
  const isRisk = variant === "risk";
  const barColor = isRisk
    ? numValue >= 70 ? "bg-kdd-red" : numValue >= 40 ? "bg-kdd-yellow" : "bg-kdd-green"
    : numValue >= 80 ? "bg-kdd-green" : numValue >= 50 ? "bg-kdd-yellow" : "bg-kdd-red";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="w-28 text-xs text-kdd-dim">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-700">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${numValue}%` }} />
      </div>
      <span className={`w-10 text-right font-mono text-xs ${isRisk ? "text-kdd-red" : "text-kdd-text"}`}>
        {numValue}%
      </span>
    </div>
  );
}
