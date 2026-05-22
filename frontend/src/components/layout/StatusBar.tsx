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
    <footer className="flex items-center justify-between border-t border-zinc-800/60 bg-zinc-950 px-6 py-1.5">
      <div className="flex items-center gap-4">
        {services.map((svc) => (
          <div key={svc.name} className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] text-zinc-500">{svc.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 text-[11px] text-zinc-600">
        <span>latency {latency} ms p95</span>
        <span>mock mode active</span>
      </div>
    </footer>
  );
}
