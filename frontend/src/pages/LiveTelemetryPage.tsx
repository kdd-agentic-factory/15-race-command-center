import { useEffect, useRef, useState, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

type TelemetrySample = {
  ts: number;
  phase: string;
  speed: number;
  tps: number;
  brake_press_front: number;
  imu_roll: number;
  tire_temp_carcass: number;
  spin_ratio: number;
  rpm: number;
  physics_loss: number;
  imu_drift: number;
};

const MAX_HISTORY = 120;

function RiskBadge({ value, thresholds }: { value: number; thresholds: [number, number] }) {
  const cls =
    value > thresholds[1] ? "badge-danger" : value > thresholds[0] ? "badge-warn" : "badge-ok";
  const label = value > thresholds[1] ? "critical" : value > thresholds[0] ? "watch" : "ok";
  return <span className={cls}>{label}</span>;
}

export function LiveTelemetryPage() {
  const [history, setHistory] = useState<TelemetrySample[]>([]);
  const [latest, setLatest] = useState<TelemetrySample | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    const ws = new WebSocket(`ws://${window.location.hostname}:8150/ws/telemetry`);
    wsRef.current = ws;
    ws.onmessage = (ev) => {
      const sample: TelemetrySample = JSON.parse(ev.data);
      setLatest(sample);
      setHistory((h) => {
        const next = [...h, { ...sample, ts: Date.now() }];
        return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
      });
    };
    ws.onclose = () => setTimeout(connect, 2000);
    return ws;
  }, []);

  useEffect(() => {
    const ws = connect();
    return () => ws.close();
  }, [connect]);

  const chartData = history.map((s, i) => ({
    i,
    speed: s.speed,
    tps: s.tps,
    spin: +(s.spin_ratio * 1000).toFixed(1),
    brake: s.brake_press_front,
  }));

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Live Telemetry</p>
        <h1 className="mt-2 text-3xl font-semibold">High-frequency stream</h1>
        <p className="mt-2 text-zinc-400">WebSocket · 10 Hz · Jerez FP2</p>
      </header>

      {latest && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {[
            { label: "Speed", value: `${Math.round(latest.speed)}`, unit: "km/h", thresh: [200, 240] as [number,number] },
            { label: "TPS", value: `${Math.round(latest.tps)}`, unit: "%", thresh: [0, 0] as [number,number] },
            { label: "Brake", value: `${latest.brake_press_front.toFixed(1)}`, unit: "bar", thresh: [8, 12] as [number,number] },
            { label: "Lean", value: `${Math.round(latest.imu_roll)}`, unit: "deg", thresh: [50, 60] as [number,number] },
            { label: "Tire", value: `${latest.tire_temp_carcass.toFixed(1)}`, unit: "°C", thresh: [110, 120] as [number,number] },
            { label: "Spin", value: latest.spin_ratio.toFixed(4), unit: "", thresh: [0.06, 0.09] as [number,number] },
          ].map(({ label, value, unit, thresh }) => (
            <div key={label} className="panel text-center">
              <p className="text-xs text-zinc-500">{label}</p>
              <p className="mt-1 text-2xl font-bold">{value}</p>
              <p className="mt-0.5 text-xs text-zinc-600">{unit}</p>
              <div className="mt-2">
                <RiskBadge value={+value} thresholds={thresh} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="panel">
        <h2 className="mb-4 text-sm font-semibold text-zinc-400">
          Speed · TPS · Spin (×1000) · Brake — last {MAX_HISTORY} samples
        </h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="i" tick={false} />
            <YAxis stroke="#52525b" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", fontSize: 11 }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="speed" stroke="#38bdf8" dot={false} strokeWidth={1.5} />
            <Line type="monotone" dataKey="tps" stroke="#4ade80" dot={false} strokeWidth={1.5} />
            <Line type="monotone" dataKey="spin" stroke="#f87171" dot={false} strokeWidth={1.5} />
            <Line type="monotone" dataKey="brake" stroke="#fbbf24" dot={false} strokeWidth={1.5} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {latest && (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="panel">
            <h3 className="text-sm font-semibold text-zinc-400">Corner Phase</h3>
            <div className="mt-3 flex gap-2">
              {["braking", "apex", "drive"].map((p) => (
                <span
                  key={p}
                  className={`flex-1 rounded-lg py-2 text-center text-sm font-medium capitalize transition-colors ${
                    latest.phase === p
                      ? "bg-red-600 text-white"
                      : "bg-zinc-900 text-zinc-500"
                  }`}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div className="panel">
            <h3 className="text-sm font-semibold text-zinc-400">Physics Loss</h3>
            <p className="mt-2 text-4xl font-bold">{latest.physics_loss?.toFixed(4)}</p>
            <p className="mt-1 text-xs text-zinc-500">data + physics + boundary residual</p>
          </div>
          <div className="panel">
            <h3 className="text-sm font-semibold text-zinc-400">IMU Drift</h3>
            <p className="mt-2 text-4xl font-bold">{latest.imu_drift?.toFixed(3)}</p>
            <p className="mt-1 text-xs text-zinc-500">UKF-M corrected bias</p>
          </div>
        </div>
      )}
    </div>
  );
}
