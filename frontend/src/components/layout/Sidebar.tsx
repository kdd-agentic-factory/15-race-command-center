import { NavLink } from "react-router-dom";
import {
  Activity,
  Map,
  Circle,
  Settings,
  Cpu,
  Wrench,
  Calendar,
  Users,
  Bot,
  FlaskConical,
  FileText,
  LayoutDashboard,
  Settings2,
} from "lucide-react";

const items: [string, string, React.ComponentType<{ className?: string }>][] = [
  ["/", "Overview", LayoutDashboard],
  ["/telemetry", "Live Telemetry", Activity],
  ["/circuit", "Circuit Intelligence", Map],
  ["/tires", "Tire Degradation", Circle],
  ["/setup", "Setup Management", Settings],
  ["/parts", "Parts Design", Cpu],
  ["/pre-gp", "Pre-Grand Prix", Calendar],
  ["/crew-chief", "Crew Chief", Users],
  ["/copilot", "AI Copilot", Bot],
  ["/digital-twin", "Digital Twin", FlaskConical],
  ["/reports", "Reports", FileText],
  ["/settings", "Settings", Settings2],
];

export function Sidebar() {
  return (
    <aside className="flex w-64 flex-shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="border-b border-zinc-800 p-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-red-500">
          KDD Race
        </p>
        <h1 className="mt-1 text-base font-semibold leading-tight">
          Command Center
        </h1>
        <p className="mt-0.5 text-[11px] text-zinc-500">Race Engineering OS</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {items.map(([href, label, Icon]) => (
          <NavLink
            key={href}
            to={href}
            end={href === "/"}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-red-600 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
              ].join(" ")
            }
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-zinc-800 p-4">
        <p className="text-[10px] text-zinc-600">v0.1.0 · mock mode</p>
      </div>
    </aside>
  );
}
