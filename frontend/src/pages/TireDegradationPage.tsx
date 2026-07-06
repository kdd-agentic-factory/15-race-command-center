import { useEffect, useRef, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useRaceSession } from "../hooks/useRaceSession";
import {
  sessionBadgeLabel,
  getDegradationMessages,
  SESSION_BADGE_CLASSES,
} from "../lib/session-badge";

type TireState = "normal" | "watch" | "degrading" | "critical" | "collapse_predicted";

function getTireState(temp: number, spin: number): TireState {
  if (temp > 125 || spin > 0.09) return "collapse_predicted";
  if (temp > 120 || spin > 0.07) return "critical";
  if (temp > 115 || spin > 0.05) return "degrading";
  if (temp > 110 || spin > 0.03) return "watch";
  return "normal";
}

const stateColors: Record<TireState, string> = {
  normal: "text-emerald-400 badge-ok",
  watch: "text-amber-400 badge-warn",
  degrading: "text-orange-400 badge-warn",
  critical: "text-red-400 badge-danger",
  collapse_predicted: "text-red-300 badge-danger",
};

export function TireDegradationPage() {
  const { session, hasPersistedSession } = useRaceSession();
  const [history, setHistory] = useState<{ i: number; temp: number; spin: number }[]>([]);
  const tickRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      const t = tickRef.current++;
      const temp = 103 + Math.min(t / 28, 18) + Math.max((t % 110) - 58, 0) * 0.035;
      const spinBase = t % 110 >= 52 ? ((t % 110) - 52) * 0.00145 : 0.004;
      const spin = Math.max(0, spinBase + Math.sin(t / 5) * 0.004);
      setHistory((h) => {
        const next = [...h, { i: t, temp: +temp.toFixed(1), spin: +spin.toFixed(4) }];
        return next.length > 120 ? next.slice(-120) : next;
      });
    }, 200);
    return () => clearInterval(id);
  }, []);

  const latest = history.at(-1);
  const tireState: TireState = latest ? getTireState(latest.temp, latest.spin) : "normal";
  const riskPct = latest ? Math.min(96, Math.round(58 + latest.spin * 320 + (latest.temp - 105) * 1.8)) : 0;

  const badgeLabel = sessionBadgeLabel(session, hasPersistedSession);
  const degradationMessages = getDegradationMessages(
    session.telemetryStatus,
    session.circuitConfidence,
    session.dataSource,
  );

  return (
    <div className="bg-kdd-bg text-kdd-text space-y-6">
      <header>
        <div className="flex items-center gap-3">
          <p className="eyebrow">Tyre / Grip</p>
          <span className={SESSION_BADGE_CLASSES}>{badgeLabel}</span>
        </div>
        <h1 className="mt-2 text-3xl font-semibold">Carcass thermal & spin analysis</h1>
        <p className="mt-2 text-kdd-muted">
          {session.circuitName} · {session.mode.toUpperCase()} · Real-time degradation state · Collapse prediction · TCS activity
        </p>
      </header>

      {degradationMessages.length > 0 && (
        <div className="space-y-2">
          {degradationMessages.map((msg) => (
            <div
              key={msg}
              className="rounded-kdd-md border border-kdd-yellow/40 bg-kdd-yellow-dim px-4 py-2 text-sm text-kdd-yellow"
            >
              {msg}
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="panel">
          <p className="text-sm text-kdd-dim">Tire State</p>
          <p className="mt-2 text-2xl font-bold capitalize">{tireState.replace("_", " ")}</p>
          <div className="mt-2">
            <span className={stateColors[tireState]}>{tireState}</span>
          </div>
        </div>
        <div className="panel">
          <p className="text-sm text-kdd-dim">Carcass Temp</p>
          <p className="mt-2 text-3xl font-bold">{latest?.temp.toFixed(1) ?? "--"} °C</p>
          <p className="mt-1 text-xs text-kdd-dim">baseline 103 °C</p>
        </div>
        <div className="panel">
          <p className="text-sm text-kdd-dim">Spin Ratio</p>
          <p className="mt-2 text-3xl font-bold">{latest?.spin.toFixed(4) ?? "--"}</p>
          <p className="mt-1 text-xs text-kdd-dim">threshold 0.060</p>
        </div>
      </div>

      <div className="panel">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-kdd-muted">Collapse Risk</h2>
          <span className="font-kdd-mono text-2xl font-bold text-kdd-accent">{riskPct}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-kdd-surface">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500 transition-all"
            style={{ width: `${riskPct}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-kdd-muted">
          {riskPct > 78
            ? "Critical: Switch to Engine Map 2, reduce torque at T05/T08/T13."
            : riskPct > 58
            ? "Watch: Monitor spin ratio through drive phases."
            : "Normal: Within thermal envelope."}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel">
          <h2 className="mb-4 text-sm font-semibold text-kdd-muted">Carcass Temperature</h2>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="i" tick={false} />
              <YAxis domain={[100, 130]} stroke="#52525b" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", fontSize: 11 }} />
              <Area type="monotone" dataKey="temp" stroke="#f87171" fill="#f87171" fillOpacity={0.15} strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="panel">
          <h2 className="mb-4 text-sm font-semibold text-kdd-muted">Spin Ratio</h2>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="i" tick={false} />
              <YAxis domain={[0, 0.12]} stroke="#52525b" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", fontSize: 11 }} />
              <Area type="monotone" dataKey="spin" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.15} strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
