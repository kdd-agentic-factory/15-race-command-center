import { ExternalLink, FlaskConical } from "lucide-react";
import { LIGHTWEIGHTING_LAB } from "../../data/rcc-research-bridge-data";

export function ResearchBridgeCard() {
  const lab = LIGHTWEIGHTING_LAB;

  return (
    <div className="rounded-lg border border-kdd-amber/30 bg-kdd-amber-dim/10 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-kdd-amber-dim/30">
          <FlaskConical className="h-4 w-4 text-kdd-amber" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-kdd-text">{lab.title}</h3>
            <span className="rounded-full bg-kdd-amber-dim/20 px-2 py-0.5 text-[10px] font-medium text-kdd-amber">
              Research
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-kdd-dim">{lab.evidence}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <a
              href={lab.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-kdd-amber px-3 py-1.5 text-xs font-bold text-white hover:bg-kdd-amber/80"
            >
              {lab.cta} <ExternalLink className="h-3 w-3" />
            </a>
            <span className="text-[10px] text-kdd-dim">
              {lab.source} &middot; {lab.concepts.join(" / ")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
