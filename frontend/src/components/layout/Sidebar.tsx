import type { ComponentType } from "react";
import { NavLink } from "react-router-dom";
import {
  Activity,
  Map,
  Wrench,
  Users,
  Bot,
  FileText,
  Settings2,
  Flag,
  Compass,
  CircleDot,
  Box,
  LayoutDashboard,
} from "lucide-react";

type NavSection = {
  label: string;
  items: [string, string, ComponentType<{ className?: string }>][];
};

const sections: NavSection[] = [
  {
    label: "Mission Control",
    items: [["/launch", "Session Launch", Compass]],
  },
  {
    label: "PitWall OS",
    items: [
      ["/pitwall", "PitWall Cockpit", LayoutDashboard],
      ["/telemetry", "Live Telemetry", Activity],
      ["/circuit", "Circuit Intelligence", Map],
      ["/tires", "Tyre / Grip", CircleDot],
      ["/setup", "Setup Management", Wrench],
    ],
  },
  {
    label: "Decision Layer",
    items: [
      ["/crew-chief", "Crew Chief", Users],
      ["/strategy", "Race Strategy", Flag],
      ["/copilot", "AI Copilot", Bot],
    ],
  },
  {
    label: "Prediction & Output",
    items: [
      ["/digital-twin", "Digital Twin", Box],
      ["/reports", "Reports / Debrief", FileText],
    ],
  },
  {
    label: "Platform",
    items: [["/settings", "Settings", Settings2]],
  },
];

export function Sidebar() {
  return (
    <aside className="flex w-64 flex-shrink-0 flex-col border-r border-kdd-border bg-kdd-bg">
      <div className="border-b border-kdd-border p-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-kdd-accent">
          KDD Race
        </p>
        <h1 className="mt-1 text-base font-semibold leading-tight text-kdd-text">
          Command Center
        </h1>
        <p className="mt-0.5 text-[11px] text-kdd-dim">Race Engineering OS</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-3">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="mb-1 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-kdd-dim">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map(([href, label, Icon]) => (
                <NavLink
                  key={href}
                  to={href}
                  end={href === "/"}
                  className={({ isActive }) =>
                    [
                      "flex min-h-[44px] items-center gap-3 rounded-kdd-md px-3 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-accent",
                      isActive
                        ? "bg-kdd-accent text-white"
                        : "text-kdd-dim hover:bg-kdd-surface hover:text-kdd-text",
                    ].join(" ")
                  }
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-kdd-border p-4">
        <p className="text-[10px] font-kdd-mono text-kdd-dim">v0.1.0 · mock mode</p>
      </div>
    </aside>
  );
}
