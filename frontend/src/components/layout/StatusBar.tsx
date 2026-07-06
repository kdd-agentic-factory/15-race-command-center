import { useEffect, useState } from "react";

const services = [
  { name: "telemetry", label: "Telemetry" },
  { name: "copilot", label: "Copilot" },
  { name: "digital-twin", label: "Digital Twin" },
  { name: "kdd-pipelines", label: "KDD" },
];

export function StatusBar() {
  const [latency, setLatency] = useState(42);

  useEffect(() => {
    const id = setInterval(() => {
      setLatency(Math.round(38 + Math.sin(Date.now() / 800) * 7));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="flex items-center justify-between border-t border-kdd-border bg-kdd-bg px-6 py-1.5">
      <div className="flex items-center gap-4">
        {services.map((svc) => (
          <div key={svc.name} className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-kdd-green" />
            <span className="text-[11px] font-kdd-mono text-kdd-dim">{svc.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 text-[11px] font-kdd-mono text-kdd-dim">
        <span>latency {latency} ms p95</span>
        <span>mock mode active</span>
      </div>
    </footer>
  );
}
