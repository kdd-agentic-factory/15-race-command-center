import { useState, useEffect } from "react";
import { Radio, Clock, MapPin, Gauge } from "lucide-react";

export function Topbar() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [lap, setLap] = useState(14);

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
      setLap((l) => l + (Math.random() > 0.97 ? 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="flex items-center justify-between border-b border-kdd-border bg-kdd-bg px-6 py-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-kdd-green" />
          <span className="text-kdd-green font-medium">LIVE</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-kdd-dim">
          <MapPin className="h-3.5 w-3.5 text-kdd-accent" />
          <span className="font-kdd-sans">Jerez · FP2</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-kdd-dim">
          <Gauge className="h-3.5 w-3.5" />
          <span>
            Lap <strong className="text-kdd-text">{lap}</strong>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 text-xs text-kdd-dim sm:flex">
          <Radio className="h-3.5 w-3.5" />
          <span className="font-kdd-mono">jerez-fp2-2026-05-03</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-kdd-dim">
          <Clock className="h-3.5 w-3.5 text-kdd-dim" />
          <span className="font-kdd-mono text-xs text-kdd-text">{time}</span>
        </div>
      </div>
    </header>
  );
}
