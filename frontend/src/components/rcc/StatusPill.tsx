import type { ModuleBadge } from "../../config/raceCommandModules";

interface StatusPillProps {
  label: string;
  variant?: "success" | "warning" | "info" | "danger" | "default";
  dot?: boolean;
  className?: string;
}

const VARIANT_STYLES: Record<string, string> = {
  success: "bg-kdd-green-dim text-kdd-green",
  warning: "bg-kdd-yellow-dim text-kdd-yellow",
  info: "bg-kdd-cyan-dim text-kdd-cyan",
  danger: "bg-kdd-red-dim text-kdd-red",
  default: "bg-zinc-800 text-kdd-dim",
};

export function StatusPill({ label, variant = "default", dot = true, className = "" }: StatusPillProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${VARIANT_STYLES[variant]} ${className}`}>
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${
          variant === "success" ? "bg-kdd-green" :
          variant === "warning" ? "bg-kdd-yellow" :
          variant === "danger" ? "bg-kdd-red" :
          variant === "info" ? "bg-kdd-cyan" :
          "bg-kdd-dim"
        }`} />
      )}
      {label}
    </span>
  );
}

interface BadgePillProps {
  badge: ModuleBadge;
}

export function BadgePill({ badge }: BadgePillProps) {
  const styles: Record<string, string> = {
    AI: "bg-kdd-accent-dim text-kdd-accent",
    LIVE: "bg-kdd-green-dim text-kdd-green",
    "10Hz": "bg-kdd-cyan-dim text-kdd-cyan",
    PDF: "bg-kdd-orange-dim text-kdd-orange",
    PREVIEW: "bg-kdd-yellow-dim text-kdd-yellow",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles[badge] || styles.AI}`}>
      {badge}
    </span>
  );
}
