// === Research-to-Product Bridge — Shared Data ===
// Links SpecForge Lightweighting Lab to RCC Engineering modules

export const LIGHTWEIGHTING_LAB_URL =
  "https://ep3nru4k.insforge.site/lightweighting-lab/";

export const LIGHTWEIGHTING_LAB = {
  title: "Structural + Digital Lightweighting Lab",
  subtitle: "Research-backed optimization",
  source: "Scientific Reports 2026",
  url: LIGHTWEIGHTING_LAB_URL,
  concepts: ["K<->H", "BESO", "GPTQ/AWQ", "FoSdig", "IPW", "INT4"] as const,
  summary:
    "Translates structural sensitivity and digital compression principles into design and edge-AI feasibility decisions.",
  evidence:
    "This module is grounded in the same sensitivity-guided reduction logic used by the K<->H Lightweighting Lab.",
  cta: "Open Lightweighting Lab",
};

export const ENGINEERING_MODULES_WITH_BRIDGE = [
  "engineering-control",
  "chassis-geometry",
  "brake-thermal",
  "aerodynamics",
  "fuel-energy",
  "setup-lab",
  "bike-comparison",
  "parts",
] as const;
