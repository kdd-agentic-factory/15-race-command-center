export function fmtMs(ms: number): string {
  const sign = ms < 0 ? "−" : "+";
  return `${sign}${Math.abs(ms).toFixed(0)} ms`;
}

export function fmtLapTime(ms: number): string {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return `${m}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

export function fmtTemp(c: number): string {
  return `${c.toFixed(1)} °C`;
}

export function fmtSpin(ratio: number): string {
  return ratio.toFixed(4);
}
