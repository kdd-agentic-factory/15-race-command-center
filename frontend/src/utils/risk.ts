export type RiskLevel = "low" | "medium" | "high" | "critical";

export function classifySpinRisk(spinRatio: number): RiskLevel {
  if (spinRatio < 0.03) return "low";
  if (spinRatio < 0.06) return "medium";
  if (spinRatio < 0.09) return "high";
  return "critical";
}

export function classifyTireRisk(tempC: number, baselineC = 105): RiskLevel {
  const delta = tempC - baselineC;
  if (delta < 5) return "low";
  if (delta < 12) return "medium";
  if (delta < 20) return "high";
  return "critical";
}

export function riskClass(risk: RiskLevel): string {
  switch (risk) {
    case "low": return "badge-ok";
    case "medium": return "badge-warn";
    case "high":
    case "critical": return "badge-danger";
  }
}
