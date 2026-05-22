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
    <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6 py-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-emerald-400 font-medium">LIVE</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-zinc-400">
          <MapPin className="h-3.5 w-3.5 text-red-500" />
          <span>Jerez · FP2</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-zinc-400">
          <Gauge className="h-3.5 w-3.5" />
          <span>
            Lap <strong className="text-zinc-100">{lap}</strong>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 text-xs text-zinc-500 sm:flex">
          <Radio className="h-3.5 w-3.5" />
          <span>jerez-fp2-2026-05-03</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-zinc-300">
          <Clock className="h-3.5 w-3.5 text-zinc-500" />
          <span className="font-mono text-xs">{time}</span>
        </div>
      </div>
    </header>
  );
}
