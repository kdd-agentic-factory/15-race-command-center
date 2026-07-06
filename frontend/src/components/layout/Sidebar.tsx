import { NavLink } from "react-router-dom";
import { modulesBySection, RACE_MODULES } from "../../config/raceCommandModules";
import type { RaceModule, ModuleSection } from "../../config/raceCommandModules";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

const SECTION_LABELS: Record<ModuleSection, string> = {
  Command: "Command",
  "Platform Intelligence": "Platform Intelligence",
  Engineering: "Engineering",
  "Track & Competition": "Track & Competition",
};

const SECTION_ORDER: ModuleSection[] = [
  "Command",
  "Platform Intelligence",
  "Engineering",
  "Track & Competition",
];

const BADGE_COLORS: Record<string, string> = {
  AI: "bg-kdd-accent-dim text-kdd-accent",
  LIVE: "bg-kdd-green-dim text-kdd-green",
  "10Hz": "bg-kdd-cyan-dim text-kdd-cyan",
  PDF: "bg-kdd-orange-dim text-kdd-orange",
  PREVIEW: "bg-kdd-yellow-dim text-kdd-yellow",
};

function ModuleNavItem({ mod, collapsed }: { mod: RaceModule; collapsed: boolean }) {
  const Icon = mod.icon;

  if (collapsed) {
    return (
      <NavLink
        to={mod.route}
        end={mod.route === "/"}
        title={mod.label}
        className={({ isActive }) =>
          [
            "flex items-center justify-center rounded-kdd-md p-2.5 transition-colors",
            isActive
              ? "bg-kdd-accent text-white"
              : "text-kdd-dim hover:bg-kdd-surface hover:text-kdd-text",
          ].join(" ")
        }
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
      </NavLink>
    );
  }

  return (
    <div className="group relative">
      <NavLink
        to={mod.route}
        end={mod.route === "/"}
        className={({ isActive }) =>
          [
            "flex min-h-[36px] items-center gap-2.5 rounded-kdd-md px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-accent",
            isActive
              ? "bg-kdd-accent text-white"
              : "text-kdd-dim hover:bg-kdd-surface hover:text-kdd-text",
          ].join(" ")
        }
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1 truncate">{mod.label}</span>

        {/* Status dot */}
        <span
          className={[
            "h-1.5 w-1.5 flex-shrink-0 rounded-full",
            mod.status === "available" ? "bg-kdd-green" :
            mod.status === "preview" ? "bg-kdd-yellow" :
            "bg-kdd-dim",
          ].join(" ")}
        />

        {/* Badge */}
        {mod.badge && (
          <span
            className={[
              "ml-1 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none tracking-wider",
              BADGE_COLORS[mod.badge] ?? "bg-kdd-accent-dim text-kdd-accent",
            ].join(" ")}
          >
            {mod.badge}
          </span>
        )}
      </NavLink>
    </div>
  );
}

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const groups = modulesBySection();
  const [expandedSections, setExpandedSections] = useState<Set<ModuleSection>>(
    () => new Set(SECTION_ORDER)
  );

  const toggleSection = (section: ModuleSection) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  return (
    <aside
      className={[
        "flex flex-shrink-0 flex-col border-r border-kdd-border bg-kdd-bg transition-all duration-200",
        collapsed ? "w-14" : "w-64",
      ].join(" ")}
    >
      {/* Header */}
      <div className="border-b border-kdd-border p-5">
        {collapsed ? (
          <p className="text-center text-[10px] font-bold uppercase tracking-wider text-kdd-accent">
            KDD
          </p>
        ) : (
          <>
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-kdd-accent">
              KDD Race
            </p>
            <h1 className="mt-1 text-base font-semibold leading-tight text-kdd-text">
              Command Center
            </h1>
            <p className="mt-0.5 text-[11px] text-kdd-dim">Race Engineering OS</p>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {SECTION_ORDER.map((section) => {
          const items = groups[section];
          if (!items || items.length === 0) return null;

          const isExpanded = expandedSections.has(section);

          return (
            <div key={section}>
              {/* Section header — clickable to collapse */}
              <button
                onClick={() => toggleSection(section)}
                className={[
                  "flex w-full items-center px-3 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-kdd-dim transition-colors hover:text-kdd-text",
                  collapsed && "justify-center",
                ].join(" ")}
              >
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{SECTION_LABELS[section]}</span>
                    <span className="ml-1 flex-shrink-0 text-[9px] text-kdd-dim">
                      {isExpanded ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </span>
                  </>
                )}
              </button>

              {/* Module items */}
              {isExpanded && (
                <div className="space-y-0.5">
                  {items.map((mod) => (
                    <ModuleNavItem key={mod.id} mod={mod} collapsed={collapsed} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-kdd-border p-4">
        {collapsed ? (
          <p className="text-center text-[9px] font-kdd-mono text-kdd-dim">v0.1</p>
        ) : (
          <>
            <p className="text-[10px] font-kdd-mono text-kdd-dim">v0.1.0 · mock mode</p>
            {onToggle && (
              <button
                onClick={onToggle}
                className="mt-2 text-[10px] text-kdd-dim underline hover:text-kdd-text"
              >
                Collapse
              </button>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
