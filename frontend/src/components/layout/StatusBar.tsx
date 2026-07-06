import { useEffect, useState } from "react";
import { RACE_MODULES } from "../../config/raceCommandModules";
import { Wifi, WifiOff } from "lucide-react";

type ServiceStatus = "connected" | "degraded" | "offline";

interface ServiceCheck {
  id: string;
  label: string;
  status: ServiceStatus;
}

const CHECK_SERVICES = [
  { id: "telemetry", label: "Telemetry" },
  { id: "copilot", label: "Copilot" },
  { id: "digital-twin", label: "Digital Twin" },
  { id: "platform", label: "Platform" },
  { id: "pipelines", label: "Pipelines" },
];

const STATUS_COLORS: Record<ServiceStatus, string> = {
  connected: "bg-kdd-green",
  degraded: "bg-kdd-yellow",
  offline: "bg-kdd-red",
};

export function StatusBar() {
  const [latency, setLatency] = useState(42);
  const [checks, setChecks] = useState<ServiceCheck[]>(
    CHECK_SERVICES.map((s) => ({ ...s, status: "connected" }))
  );

  // Simulate live platform health checks (runs every 5s)
  useEffect(() => {
    const id = setInterval(() => {
      setLatency(Math.round(38 + Math.sin(Date.now() / 800) * 7));
      setChecks(
        CHECK_SERVICES.map((s) => ({
          ...s,
          status: (Math.random() > 0.15 ? "connected" : Math.random() > 0.5 ? "degraded" : "offline") as ServiceStatus,
        }))
      );
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // Latency tick (every 1s)
  useEffect(() => {
    const id = setInterval(() => {
      setLatency((l) => Math.round(38 + Math.sin(Date.now() / 800) * 7));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const implementedCount = RACE_MODULES.filter((m) => m.implemented).length;
  const availableCount = RACE_MODULES.filter((m) => m.status === "available").length;
  const onlineCount = checks.filter((c) => c.status !== "offline").length;

  return (
    <footer className="flex items-center justify-between border-t border-kdd-border bg-kdd-bg px-6 py-1.5">
      {/* Left: service health checks */}
      <div className="flex items-center gap-4">
        {checks.map((svc) => (
          <div key={svc.id} className="flex items-center gap-1.5">
            <span
              className={[
                "h-1.5 w-1.5 rounded-full transition-colors duration-500",
                STATUS_COLORS[svc.status],
              ].join(" ")}
            />
            <span className="text-[11px] font-kdd-mono text-kdd-dim">{svc.label}</span>
          </div>
        ))}

        {/* Overall connectivity */}
        <div className="ml-2 flex items-center gap-1.5 border-l border-kdd-border pl-3">
          {onlineCount === checks.length ? (
            <Wifi className="h-3 w-3 text-kdd-green" />
          ) : (
            <WifiOff className="h-3 w-3 text-kdd-yellow" />
          )}
          <span className="text-[11px] font-kdd-mono text-kdd-dim">
            {onlineCount}/{checks.length} online
          </span>
        </div>
      </div>

      {/* Right: module stats + latency */}
      <div className="flex items-center gap-3 text-[11px] font-kdd-mono text-kdd-dim">
        <span>
          {implementedCount}/{RACE_MODULES.length} modules
        </span>
        <span>latency {latency} ms p95</span>
        <span>mock mode active</span>
      </div>
    </footer>
  );
}
