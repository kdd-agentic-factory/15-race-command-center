import { Activity, Bot, FlaskConical, Cpu, AlertTriangle, CheckCircle, Clock } from "lucide-react";

const services = [
  { name: "KDD Pipelines", id: "06", status: "ok", latency: "38ms" },
  { name: "AI Copilot", id: "16", status: "ok", latency: "120ms" },
  { name: "Digital Twin", id: "17", status: "ok", latency: "85ms" },
  { name: "Documentation Agent", id: "05", status: "ok", latency: "65ms" },
  { name: "Orchestrator", id: "01", status: "ok", latency: "22ms" },
  { name: "Observability", id: "09", status: "ok", latency: "15ms" },
];

const recentAlerts = [
  { id: 1, level: "warning", message: "Rear tire carcass temperature rising — T13 drive phase", time: "2m ago" },
  { id: 2, level: "info", message: "Simulation sim-map2-jerez completed", time: "5m ago" },
  { id: 3, level: "warning", message: "Rear spin ratio above 0.06 threshold — lap 12", time: "8m ago" },
];

export function PlatformOverviewPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Platform Overview</p>
        <h1 className="mt-2 text-3xl font-semibold">Race Engineering OS</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Central operational view of the KDD-governed agentic race engineering platform.
          Monitor service health, active session, and system-wide alerts.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="panel">
          <p className="text-sm text-zinc-500">Active Session</p>
          <p className="mt-1 text-lg font-semibold">Jerez · FP2</p>
          <p className="mt-1 text-xs text-zinc-500">jerez-fp2-2026-05-03</p>
        </div>
        <div className="panel">
          <p className="text-sm text-zinc-500">Current Lap</p>
          <p className="mt-1 text-3xl font-bold text-red-500">14</p>
          <p className="mt-1 text-xs text-zinc-500">Best: 1:38.412</p>
        </div>
        <div className="panel">
          <p className="text-sm text-zinc-500">Active Alerts</p>
          <p className="mt-1 text-3xl font-bold text-amber-400">2</p>
          <p className="mt-1 text-xs text-zinc-500">1 warning · 1 watch</p>
        </div>
        <div className="panel">
          <p className="text-sm text-zinc-500">Decisions Pending</p>
          <p className="mt-1 text-3xl font-bold text-zinc-100">2</p>
          <p className="mt-1 text-xs text-zinc-500">Crew chief review required</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Service Health
          </h2>
          {services.map((svc) => (
            <div key={svc.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-sm">
                  {svc.id} · {svc.name}
                </span>
              </div>
              <span className="font-mono text-xs text-zinc-500">{svc.latency}</span>
            </div>
          ))}
        </div>

        <div className="panel space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Recent Alerts
          </h2>
          {recentAlerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-2">
              <AlertTriangle
                className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${
                  alert.level === "warning" ? "text-amber-400" : "text-zinc-500"
                }`}
              />
              <div className="min-w-0">
                <p className="text-sm leading-snug">{alert.message}</p>
                <p className="mt-0.5 text-xs text-zinc-600">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Activity, label: "Live Telemetry", desc: "10 Hz mock stream active", href: "/telemetry" },
          { icon: Bot, label: "AI Copilot", desc: "Mock mode · 5 tools available", href: "/copilot" },
          { icon: FlaskConical, label: "Digital Twin", desc: "1 simulation completed", href: "/digital-twin" },
          { icon: Cpu, label: "Parts Design", desc: "3 parts · 1 simulated", href: "/parts" },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="panel group cursor-pointer hover:border-zinc-600 transition-colors">
            <Icon className="h-5 w-5 text-red-500" />
            <p className="mt-3 font-medium">{label}</p>
            <p className="mt-1 text-sm text-zinc-500">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
