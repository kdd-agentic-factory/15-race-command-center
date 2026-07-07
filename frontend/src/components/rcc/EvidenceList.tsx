import { FileText } from "lucide-react";

interface EvidenceItem {
  label: string;
  value: string;
  source?: string;
  type?: "sensor" | "model" | "external" | "comms" | "historical";
}

interface EvidenceListProps {
  items: EvidenceItem[];
  title?: string;
}

const TYPE_COLORS: Record<string, string> = {
  sensor: "text-kdd-red",
  model: "text-kdd-yellow",
  external: "text-kdd-cyan",
  comms: "text-kdd-accent",
  historical: "text-kdd-muted",
};

export function EvidenceList({ items, title = "Evidence & Input Data" }: EvidenceListProps) {
  return (
    <div className="panel space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-kdd-dim">{title}</h2>
      <div className="divide-y divide-kdd-border/50">
        {items.map((item, i) => (
          <div key={i} className="flex items-start justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <p className="text-sm text-kdd-muted">{item.label}</p>
              <p className="mt-0.5 font-mono text-sm text-kdd-text">{item.value}</p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              {item.type && (
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${TYPE_COLORS[item.type]} bg-current/10`}>
                  {item.type}
                </span>
              )}
              {item.source && (
                <span className="flex items-center gap-1 text-xs text-kdd-dim">
                  <FileText className="h-3 w-3" /> {item.source}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
