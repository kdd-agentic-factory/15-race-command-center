// =============================================================================
// RCC Circuit Intelligence Data — Phase 18.6
// Circuit profiles + 9 factory functions for circuit-intelligence modules
// =============================================================================
// @ts-nocheck — suppress unused-label warnings; all labels used dynamically

import type {
  ModuleDemoData,
  ModuleMetric,
  ModuleDecision,
  ModuleEvidence,
  ModuleRiskItem,
  ModuleAction,
} from "./rcc-module-demo-data";

// ---------------------------------------------------------------------------
// Circuit Profile type
// ---------------------------------------------------------------------------
export interface CircuitProfile {
  id: string;
  name: string;
  country: string;
  lengthKm: number;
  corners: number;
  leftCorners: number;
  rightCorners: number;
  longestStraightM: number;
  brakingSeverity: "low" | "medium" | "high" | "extreme";
  tyreStress: "low" | "medium" | "high" | "extreme";
  overtakingDifficulty: "easy" | "moderate" | "hard";
  gripBaseline: number;
  referenceLap: string;
  keySectors: { name: string; description: string }[];
  riskCorners: { name: string; risk: string; note: string }[];
  setupBias: "front" | "rear" | "balanced";
  avgTempC: number;
  humidityPct: number;
}

// ---------------------------------------------------------------------------
// Circuit Catalog — 10 real MotoGP circuits (2024/25 season)
// ---------------------------------------------------------------------------
const CIRCUITS: CircuitProfile[] = [
  {
    id: "mugello",
    name: "Mugello Circuit",
    country: "Italy",
    lengthKm: 5.245,
    corners: 15,
    leftCorners: 6,
    rightCorners: 9,
    longestStraightM: 1141,
    brakingSeverity: "extreme",
    tyreStress: "high",
    overtakingDifficulty: "moderate",
    gripBaseline: 86,
    referenceLap: "1:44.500",
    keySectors: [
      { name: "S1 — Bucine e Casanova", description: "Fast sweeping right-handers into downhill braking zone. Critical entry for overtaking." },
      { name: "S2 — Scarperia e Palagio", description: "High-speed esses demanding precise throttle control and balanced chassis." },
      { name: "S3 — Arrabbiata 1-2-3", description: "Three fast left-right-left flicks; rear grip and steering response are paramount." },
    ],
    riskCorners: [
      { name: "Turn 1 — San Donato", risk: "Extreme braking from 354 km/h", note: "Rear instability under heavy downshift; frequent high-sides." },
      { name: "Turn 9 — Scarperia", risk: "Blind apex with gravel trap", note: "Over-enthusiastic entry pushes wide into dirty asphalt." },
      { name: "Turn 12 — Correntaio", risk: "Off-camber exit", note: "Loss of rear traction on power application; track limits enforced." },
    ],
    setupBias: "front",
    avgTempC: 28,
    humidityPct: 45,
  },
  {
    id: "jerez",
    name: "Circuito de Jerez — Ángel Nieto",
    country: "Spain",
    lengthKm: 4.423,
    corners: 13,
    leftCorners: 5,
    rightCorners: 8,
    longestStraightM: 607,
    brakingSeverity: "medium",
    tyreStress: "medium",
    overtakingDifficulty: "moderate",
    gripBaseline: 91,
    referenceLap: "1:36.200",
    keySectors: [
      { name: "S1 — Curva Soll — Sito Pons", description: "High-speed right-hander with late apex; front-end confidence critical." },
      { name: "S2 — Dry Sack — Michelin", description: "Right-left-right complex demanding aggressive direction change." },
      { name: "S3 — Lorenzo — Ángel Nieto", description: "Final two corners; rear grip determines exit speed onto pit straight." },
    ],
    riskCorners: [
      { name: "Turn 1 — Ferrari", risk: "Fast entry, gravel on outside", note: "Rear slides under acceleration; low-side risk when cold." },
      { name: "Turn 5 — Dry Sack", risk: "Tightening radius", note: "Front washout if entry speed is too high; bump on inside kerb." },
      { name: "Turn 13 — Ángel Nieto", risk: "High-speed last corner", note: "Over-drive exit pushes wide; track limits penalty risk." },
    ],
    setupBias: "balanced",
    avgTempC: 30,
    humidityPct: 40,
  },
  {
    id: "assen",
    name: "TT Circuit Assen",
    country: "Netherlands",
    lengthKm: 4.542,
    corners: 18,
    leftCorners: 6,
    rightCorners: 12,
    longestStraightM: 487,
    brakingSeverity: "medium",
    tyreStress: "medium",
    overtakingDifficulty: "moderate",
    gripBaseline: 88,
    referenceLap: "1:31.500",
    keySectors: [
      { name: "S1 — Geert Timmer — Meeuwenmeer", description: "Opener right-hander flowing into fast left; camber aids corner speed." },
      { name: "S2 — Hoge Heide — Ramshoek", description: "Technical left-right sequence; rear tyre edge grip under constant load." },
      { name: "S3 — Ossebroeken — Veenslang", description: "Chicane and final hairpin; traction out of last corner wins drag races." },
    ],
    riskCorners: [
      { name: "Turn 4 — Meeuwenmeer", risk: "Banked off-camber", note: "Front grip loss on bank transition; frequent crashes in FP1." },
      { name: "Turn 7 — Duikersloot", risk: "Creeping under braking", note: "Rear lifts under hard braking; high-sides on power application." },
      { name: "Turn 12 — Ramshoek", risk: "Long right-hander, bumpy", note: "Chatter onset over 4 s sustained load; tyre overheating." },
    ],
    setupBias: "balanced",
    avgTempC: 20,
    humidityPct: 70,
  },
  {
    id: "sachsenring",
    name: "Sachsenring Circuit",
    country: "Germany",
    lengthKm: 3.671,
    corners: 13,
    leftCorners: 10,
    rightCorners: 3,
    longestStraightM: 700,
    brakingSeverity: "high",
    tyreStress: "medium",
    overtakingDifficulty: "hard",
    gripBaseline: 82,
    referenceLap: "1:19.500",
    keySectors: [
      { name: "S1 — Wasserwerk — Turn 1", description: "Sharp left-hand hairpin off pit straight; massive braking marker." },
      { name: "S2 — The Left-Hand Sweep", description: "Nine consecutive left-hand corners; asymmetric tyre wear is extreme." },
      { name: "S3 — Final Sweep — Finish", description: "Right-hand bend to finish; scarce overtaking opportunity." },
    ],
    riskCorners: [
      { name: "Turn 1 — Wasserwerk", risk: "Tight hairpin, zero runoff", note: "Brake fade catastrophe; wall on exit leaves no room for error." },
      { name: "Turn 8 — Foxhole", risk: "Blind entry, camber change", note: "Rear steps out under trail-braking; wall proximity is high." },
      { name: "Turn 11 — Qualle", risk: "Fast left, dirty line", note: "Grip delta between racing line and marble zone exceeds 15%." },
    ],
    setupBias: "front",
    avgTempC: 22,
    humidityPct: 55,
  },
  {
    id: "silverstone",
    name: "Silverstone Circuit",
    country: "United Kingdom",
    lengthKm: 5.900,
    corners: 18,
    leftCorners: 8,
    rightCorners: 10,
    longestStraightM: 770,
    brakingSeverity: "medium",
    tyreStress: "high",
    overtakingDifficulty: "easy",
    gripBaseline: 85,
    referenceLap: "1:57.500",
    keySectors: [
      { name: "S1 — Abbey — Farm", description: "Flat-right through Copse; front-end load peaks at 1.38 G lateral." },
      { name: "S2 — Becketts — Stowe", description: "Legendary high-speed esses; chassis stability defines lap time." },
      { name: "S3 — Vale — Club — Finish", description: "Slow complex into final straight; traction and pick-up out of Club essential." },
    ],
    riskCorners: [
      { name: "Turn 1 — Abbey", risk: "High-speed flat in 6th gear", note: "Compression over kerb unloads front; puncture risk on exit marble." },
      { name: "Turn 7 — Becketts", risk: "Multi-apex high-speed", note: "Over-cook entry and line is ruined through entire Maggotts-Becketts-Chapel." },
      { name: "Turn 15 — Village", risk: "Blind right-hander", note: "Off-camber exit with gravel trap; costly excursion under race pressure." },
    ],
    setupBias: "rear",
    avgTempC: 18,
    humidityPct: 65,
  },
  {
    id: "misano",
    name: "Misano World Circuit Marco Simoncelli",
    country: "Italy",
    lengthKm: 4.226,
    corners: 16,
    leftCorners: 6,
    rightCorners: 10,
    longestStraightM: 565,
    brakingSeverity: "medium",
    tyreStress: "medium",
    overtakingDifficulty: "moderate",
    gripBaseline: 87,
    referenceLap: "1:31.000",
    keySectors: [
      { name: "S1 — Curvone — Quercia", description: "Fast entry into Curvone; patience required to set up Quercia overtake." },
      { name: "S2 — Tramonto — Curva del Carro", description: "Tricky left-right flick; rear grip on power is the differentiator." },
      { name: "S3 — Misano Alta — Curva del Bio", description: "Elevation changes through Alta; braking stability defines final sector." },
    ],
    riskCorners: [
      { name: "Turn 1 — Curvone", risk: "Fast right, blind entry", note: "Rear slides on power; gravel trap tight on exit." },
      { name: "Turn 8 — Curva del Carro", risk: "Uphill braking zone", note: "Front locking under downhill weight transfer; common low-side trigger." },
      { name: "Turn 14 — Curva del Bio", risk: "Tight right-hander", note: "Kerb hopping unsettles rear; track limits always enforced here." },
    ],
    setupBias: "balanced",
    avgTempC: 28,
    humidityPct: 50,
  },
  {
    id: "lemans",
    name: "Circuit Bugatti — Le Mans",
    country: "France",
    lengthKm: 4.185,
    corners: 14,
    leftCorners: 5,
    rightCorners: 9,
    longestStraightM: 674,
    brakingSeverity: "high",
    tyreStress: "medium",
    overtakingDifficulty: "moderate",
    gripBaseline: 80,
    referenceLap: "1:30.500",
    keySectors: [
      { name: "S1 — Garage Vert — La Chapelle", description: "Medium-speed entry into complex; braking markers are deceptive in damp." },
      { name: "S2 — Dunlop — Musée", description: "Iconic Dunlop esses; bike must be stable under constant direction change." },
      { name: "S3 — Chemin — Raccordement — Finish", description: "Hairpin to final corner; rear traction out of Chemin defines lap delta." },
    ],
    riskCorners: [
      { name: "Turn 1 — Garage Vert", risk: "Deceptive braking, damp", note: "Patches of morning dew persist in shade; grip drop measured at 18%." },
      { name: "Turn 4 — Dunlop", risk: "Fast right, rising blind", note: "Bike gets light over crest; front tuck-under risk on entry." },
      { name: "Turn 9 — Musée", risk: "Off-camber exit", note: "Power-oversteer on exit; wall proximity within 2 m on kerb strike." },
    ],
    setupBias: "front",
    avgTempC: 22,
    humidityPct: 60,
  },
  {
    id: "aragon",
    name: "MotorLand Aragón",
    country: "Spain",
    lengthKm: 5.077,
    corners: 17,
    leftCorners: 7,
    rightCorners: 10,
    longestStraightM: 968,
    brakingSeverity: "high",
    tyreStress: "high",
    overtakingDifficulty: "easy",
    gripBaseline: 84,
    referenceLap: "1:46.500",
    keySectors: [
      { name: "S1 — La Cerámica — Curva de la Catedral", description: "Uphill sweeping right; front tyre load sustained for 5.2 s." },
      { name: "S2 — Hairpin — Sacacorchos", description: "Tight hairpin into fast right; traction calibration window." },
      { name: "S3 — Trailer — La Torre — Finish", description: "Flowing final sector; rear grip degrades under heat cycle accumulation." },
    ],
    riskCorners: [
      { name: "Turn 2 — Curva de la Catedral", risk: "Off-camber uphill", note: "Rear spins up on gas application; high-side potential in damp." },
      { name: "Turn 7 — Hairpin", risk: "Tightest corner on calendar", note: "First-gear hairpin; front lock under trail-braking into apex." },
      { name: "Turn 14 — La Torre", risk: "Blind downhill right", note: "Braking point deceptive; riders consistently overshoot in race conditions." },
    ],
    setupBias: "rear",
    avgTempC: 26,
    humidityPct: 45,
  },
  {
    id: "valencia",
    name: "Circuit Ricardo Tormo",
    country: "Spain",
    lengthKm: 4.005,
    corners: 14,
    leftCorners: 5,
    rightCorners: 9,
    longestStraightM: 876,
    brakingSeverity: "medium",
    tyreStress: "low",
    overtakingDifficulty: "hard",
    gripBaseline: 90,
    referenceLap: "1:29.500",
    keySectors: [
      { name: "S1 — Sitges — La Curva", description: "First corner complex; braking into Sitges sets up overtake window." },
      { name: "S2 — Cacabelos — Laya", description: "Back section with flowing left-right; mid-corner speed critical." },
      { name: "S3 — Aspar — Final", description: "Long pit straight from last corner; exit traction is everything." },
    ],
    riskCorners: [
      { name: "Turn 1 — Sitges", risk: "Sharp right, cold tyres", note: "Rear grip low on opening lap; pile-up risk on race start." },
      { name: "Turn 8 — Laya", risk: "Tightening radius right", note: "Front washout when committing early; abrasive kerb unsettles bike." },
      { name: "Turn 14 — Final", risk: "High-speed exit onto straight", note: "Over-drive spins rear; loss of drive costs 0.15 s to finish line." },
    ],
    setupBias: "balanced",
    avgTempC: 22,
    humidityPct: 55,
  },
  {
    id: "portimao",
    name: "Autódromo Internacional do Algarve",
    country: "Portugal",
    lengthKm: 4.592,
    corners: 15,
    leftCorners: 6,
    rightCorners: 9,
    longestStraightM: 969,
    brakingSeverity: "high",
    tyreStress: "high",
    overtakingDifficulty: "moderate",
    gripBaseline: 79,
    referenceLap: "1:38.000",
    keySectors: [
      { name: "S1 — T1 Hairpin — T3 Rise", description: "Sharp right hairpin uphill; massive elevation change challenges brakes." },
      { name: "S2 — T4-T7 Undulating Sweep", description: "Fast drop through T5-T7; chassis must absorb compression without bottoming." },
      { name: "S3 — T11-T15 Final Section", description: "Blind crests and downhill braking; rear grip on entry is critical." },
    ],
    riskCorners: [
      { name: "Turn 1 — Hairpin", risk: "Elevation change under braking", note: "Rear wheel lifts over crest while braking; high-side pattern corner." },
      { name: "Turn 5 — Fast Drop", risk: "Compression at speed", note: "Front bottom-out risk; 3+ G vertical load spike measured." },
      { name: "Turn 15 — Final Left", risk: "Downhill blind entry", note: "Braking point is visual-only; no marker board, frequent overshoot." },
    ],
    setupBias: "rear",
    avgTempC: 26,
    humidityPct: 50,
  },
];

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

function rng(min: number, max: number, decimals = 1): number {
  const v = Math.random() * (max - min) + min;
  const f = Math.pow(10, decimals);
  return Math.round(v * f) / f;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function lapTime(secs: number, plusSecs: number): string {
  const t = secs + Math.random() * plusSecs;
  const m = Math.floor(t / 60);
  const s = (t % 60).toFixed(3);
  return `${m}:${s.padStart(6, "0")}`;
}

function getCircuit(id: string): CircuitProfile {
  const c = CIRCUITS.find((c) => c.id === id);
  if (!c) throw new Error(`Circuit "${id}" not found in catalog`);
  return c;
}

// ---------------------------------------------------------------------------
// Pre-built arrays for generating varied content
// ---------------------------------------------------------------------------

const GRIP_TRENDS = ["stable", "rising", "falling", "degrading"] as const;
const ACCENTS = ["neutral", "positive", "warning", "critical"] as const;
const TRENDS = ["up", "down", "stable"] as const;
const URGENCIES = ["low", "medium", "high", "critical"] as const;

// ---------------------------------------------------------------------------
// 1. Track Evolution — Mugello
// ---------------------------------------------------------------------------

export function trackEvolutionData(): ModuleDemoData {
  const circuit = getCircuit("mugello");
  return {
    moduleId: "track-evolution",
    status: "operational",
    summary: `Track evolution monitor for ${circuit.name}. Tracks rubber-in trend, grip delta across temp windows, stint degradation curves, and asphalt parameter drift session-over-session.`,
    metrics: [
      {
        label: "Grip Index",
        value: `${rng(84, 90, 1)}%`,
        sub: `trending ${pick(GRIP_TRENDS)} +0.6%/session`,
        accent: pick(ACCENTS),
        trend: "up",
      },
      {
        label: "Rubber-in Level",
        value: `${rng(65, 85, 1)}%`,
        sub: `${rng(8, 16, 1)} sessions to saturation`,
        accent: "positive",
        trend: "up",
      },
      {
        label: "Optimal Tyre Temp",
        value: `${rng(95, 110, 0)} °C`,
        sub: `${pick(["front", "rear"])} carcass — window ±3 °C`,
        accent: "neutral",
        trend: "stable",
      },
      {
        label: "Stint Degradation",
        value: `–${rng(0.12, 0.35, 2)} s/lap`,
        sub: `lap ${rng(8, 15, 0)}–${rng(20, 27, 0)} (end-of-stint)`,
        accent: "warning",
        trend: "up",
      },
    ],
    decision: {
      title: "Adjust tyre pressure targets for rubber-in trend?",
      recommendation: `Rubber-in saturation at ${Math.round(rng(70, 85))}% — track is still evolving. Increase front tyre pressure by 0.5 psi to widen the operating window. Model predicts +0.08 s/lap consistency gain across the stint.`,
      impact: "+0.08 s/lap consistency | reduced thermal degradation by 1.2 °C peak",
      confidence: rng(78, 92, 0),
      urgency: "medium",
      actionLabel: "Adjust Pressures",
    },
    evidence: [
      {
        label: "Grip Delta vs. Baseline",
        value: `+${rng(1.2, 3.8, 2)}%`,
        source: "Asphalt scanner array",
        type: "sensor",
      },
      {
        label: "Rubber-in Rate",
        value: `${rng(4.2, 7.8, 1)}% per session`,
        source: "Track evolution model v4.1",
        type: "model",
      },
      {
        label: "Temp Window Width",
        value: `${rng(5.5, 8.2, 1)} °C`,
        source: "Tyre OEM telemetry feed",
        type: "external",
      },
      {
        label: "Historic Saturation Gap",
        value: `${rng(2, 5, 0)} sessions`,
        source: `${circuit.name} archive (2021–2025)`,
        type: "historical",
      },
    ],
    risks: [
      { label: "Track greens suddenly (cleaning cycle)", value: `${rng(12, 25, 1)}%` },
      { label: "Over-pressure graining onset", value: `${rng(5, 12, 1)}%` },
    ],
    confidence: rng(80, 93, 0),
    nextActions: [
      {
        label: "Apply pressure adjustment",
        description: `Increase front tyre pressure by 0.5 psi for next exit. Monitor surface temp deltas over 3 timed laps.`,
        cta: "Adjust Now",
      },
      {
        label: "Review degradation curves",
        description: "Cross-reference stint data with rubber-in model to validate saturation forecast.",
        cta: "Review Curves",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 2. Track Surface — Jerez
// ---------------------------------------------------------------------------

export function trackSurfaceData(): ModuleDemoData {
  const circuit = getCircuit("jerez");
  return {
    moduleId: "track-surface",
    status: "operational",
    summary: `Real-time surface condition map for ${circuit.name}. Reports bump severity, dirty-zone grip delta, humidity-driven grip fade, and per-corner risk classification.`,
    metrics: [
      {
        label: "Bump Index",
        value: `${rng(15, 35, 1)} mm RMS`,
        sub: `${pick(["T5", "T8", "T13"])} worst affected`,
        accent: pick(ACCENTS),
        trend: "stable",
      },
      {
        label: "Dirty Zone Coverage",
        value: `${rng(8, 18, 1)}%`,
        sub: `${rng(3, 6, 0)} corners affected`,
        accent: "warning",
        trend: pick(TRENDS),
      },
      {
        label: "Grip — Racing Line",
        value: `${rng(88, 95, 1)}%`,
        sub: "clean line baseline",
        accent: "positive",
        trend: "stable",
      },
      {
        label: "Grip — Marble Zone",
        value: `${rng(62, 75, 1)}%`,
        sub: `–${rng(18, 28, 1)}% delta vs. racing line`,
        accent: "critical",
        trend: "down",
      },
    ],
    decision: {
      title: "Flag T8 dirty-zone expansion for track cleaning?",
      recommendation: `Dirty zone at T8 (Dry Sack) has expanded ${rng(0.5, 1.8, 1)} m offline. Grip delta now ${rng(20, 28, 0)}%. Request track cleaning before FP3 to open alternative line for race starts.`,
      impact: "Restores 2.5 m usable track width | reduces race-start incident probability by estimated 12%",
      confidence: rng(80, 92, 0),
      urgency: "high",
      actionLabel: "Request Cleaning",
    },
    evidence: [
      {
        label: "Offline Grip Delta",
        value: `–${rng(18, 28, 1)}%`,
        source: "Grip scanner trailer — lap 5 sweep",
        type: "sensor",
      },
      {
        label: "Humidity Risk Index",
        value: `${rng(20, 50, 1)}%`,
        source: "Surface moisture model v2.3",
        type: "model",
      },
      {
        label: "Cleaning schedule",
        value: `${pick(["Available", "Occupied until FP3", "Requested — pending"])}`,
        source: "Circuit ops radio",
        type: "comms",
      },
      {
        label: "T8 Grip — 2024 Race",
        value: `${rng(81, 89, 1)}%`,
        source: "Historical surface logs",
        type: "historical",
      },
    ],
    risks: [
      { label: "Cleaning does not arrive before FP3", value: `${rng(15, 30, 1)}%` },
      { label: "Surface rubber strips away with cleaning", value: `${rng(5, 15, 1)}%` },
    ],
    confidence: rng(78, 91, 0),
    nextActions: [
      {
        label: "Request track cleaning",
        description: "Submit cleaning request for T8 dirty zone to circuit operations.",
        cta: "Request",
      },
      {
        label: "Alert rider of offline risk",
        description: "Flag T8 offline grip delta on rider comms channel before next session.",
        cta: "Alert Rider",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 3. Event Engine — Assen (race weekend simulation)
// ---------------------------------------------------------------------------

export function eventEngineData(): ModuleDemoData {
  const circuit = getCircuit("assen");
  const currentSession = pick(["FP1", "FP2", "FP3", "Qualifying", "Warm-up", "Race"]);
  const activeFlag = pick(["Green", "Yellow T2–T4", "Yellow T10–T12", "White", "Red", "Green"]);
  return {
    moduleId: "event-engine",
    status: "operational",
    summary: `Live session timeline for ${circuit.name} — ${currentSession}. Tracks flag status, pit window compliance, incident sequencing, and session state transitions across the race weekend.`,
    metrics: [
      {
        label: "Session",
        value: currentSession,
        sub: `${rng(5, 45, 0)} min elapsed`,
        accent: "neutral",
        trend: "stable",
      },
      {
        label: "Flag Status",
        value: activeFlag.includes("Red") ? "RED" : activeFlag.includes("Yellow") ? "Yellow" : "Green",
        sub: activeFlag,
        accent: activeFlag === "Green" ? "positive" : activeFlag.includes("Red") ? "critical" : "warning",
        trend: "stable",
      },
      {
        label: "Riders on Track",
        value: `${rng(18, 26, 0)}`,
        sub: `of ${rng(24, 30, 0)} entries`,
        accent: "neutral",
        trend: "stable",
      },
      {
        label: "Incidents Logged",
        value: `${rng(0, 7, 0)}`,
        sub: `${rng(0, 3, 0)} under investigation`,
        accent: pick(ACCENTS),
        trend: pick(TRENDS),
      },
    ],
    decision: {
      title: "Alert pit lane for red flag restart procedure?",
      recommendation: `Red flag shown at T5 (Meeuwenmeer) — rider #${Math.floor(rng(20, 99, 0))} crashed. No injury reported. Restart expected in ${rng(8, 18, 0)} min. Prepare second bike with adjusted gearing for cooler tyre compound.`,
      impact: "Second bike ready within 2 min window | gearing change projects +0.10 s/lap on restart",
      confidence: rng(80, 95, 0),
      urgency: "critical",
      actionLabel: "Prepare Restart",
    },
    evidence: [
      {
        label: "Incident Type",
        value: pick(["High-side T5", "Low-side T9", "Turn-1 contact", "Mechanical stop", "Track limits violation"]),
        source: "Race Control feed",
        type: "comms",
      },
      {
        label: "Restart ETA",
        value: `${rng(8, 18, 0)} min`,
        source: "Session timer model",
        type: "model",
      },
      {
        label: "Pit Window Status",
        value: `${pick(["Open", "Closed — red flag", "Opens lap 6", "Opens lap 8"])}`,
        source: "Pit-monitor integration",
        type: "external",
      },
      {
        label: "Historical Restart Outcome",
        value: `${rng(40, 65, 0)}% points scored from red-flag restarts`,
        source: "Session history DB",
        type: "historical",
      },
    ],
    risks: [
      { label: "Restart delay exceeds 20 min (track repair)", value: `${rng(5, 18, 1)}%` },
      { label: "Second bike tyre warmers not ready", value: `${rng(3, 12, 1)}%` },
    ],
    confidence: rng(82, 94, 0),
    nextActions: [
      {
        label: "Prepare second bike",
        description: `Adjusted gearing (−1 rear sprocket) for cooler restart conditions. Tyre warmers on.`,
        cta: "Prep Bike",
      },
      {
        label: "Update strategy board",
        description: "Re-calculate fuel target with 8-lap sprint restart window.",
        cta: "Update Strategy",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 4. Circuit History — Silverstone
// ---------------------------------------------------------------------------

export function circuitHistoryData(): ModuleDemoData {
  const circuit = getCircuit("silverstone");
  const year = pick(["2022", "2023", "2024", "2025"]);
  return {
    moduleId: "circuit-history",
    status: "operational",
    summary: `Historical intelligence for ${circuit.name}. Past winning strategies, overtaking hot zones by sector, weather pattern probabilities for the meeting window, and setup archetypes that delivered podiums.`,
    metrics: [
      {
        label: "Winning Strategy",
        value: `${pick(["Splash & go lap 7–9", "No-stop medium", "Two-stop hard-medium", "Sprint strategy B"])}`,
        sub: `most common in ${year}`,
        accent: "positive",
        trend: "stable",
      },
      {
        label: "Overtaking Hot Zone",
        value: pick(["T3–T4 (Wellington–Brooklands)", "T7–T8 (Becketts–Chapel)", "T15 (Village)", "Pit straight"]),
        sub: `${rng(12, 38, 0)} passes in ${year} race`,
        accent: "neutral",
        trend: "stable",
      },
      {
        label: "Win from Pole",
        value: `${rng(45, 70, 0)}%`,
        sub: `last ${rng(8, 18, 0)} editions`,
        accent: pick(ACCENTS),
        trend: "stable",
      },
      {
        label: "Weather Impact Probability",
        value: `${rng(30, 60, 0)}%`,
        sub: "rain expected within race window",
        accent: "warning",
        trend: "up",
      },
    ],
    decision: {
      title: "Adapt strategy based on historical overtaking pattern?",
      recommendation: `Silverstone's T15 (Village) sees ${rng(20, 40, 0)}% of overtakes in the last 5 editions. If qualifying P3–P7, bias setup toward rear grip for exit drive onto Hangar Straight. Strategy: undercut on lap 4–5 for track position.`,
      impact: "Projected +2.3 position gain if starting P3–P7 | undercut window validated in 4 of last 5 races",
      confidence: rng(82, 94, 0),
      urgency: "medium",
      actionLabel: "Apply History Pattern",
    },
    evidence: [
      {
        label: "T15 Overtakes (Last 5 Years)",
        value: `${rng(25, 50, 0)}% of total passes`,
        source: "Historical race analytics DB",
        type: "historical",
      },
      {
        label: "Podium Setup Archetype",
        value: pick(["Soft-Front + Hard-Rear", "Asymmetric rear preload", "Standard + low ride height", "Stiff rear + raised fork"]),
        source: "Setup mining engine",
        type: "model",
      },
      {
        label: "Rain Probability — Race Window",
        value: `${rng(25, 55, 0)}%`,
        source: "ECMWF high-res forecast",
        type: "external",
      },
      {
        label: "Pit Crew Split Time (Last 3 Years)",
        value: `${rng(2.3, 3.8, 2)} s avg`,
        source: "Pit-crew analytics",
        type: "sensor",
      },
    ],
    risks: [
      { label: "Rain does not arrive — dry-setup compromise", value: `${rng(18, 35, 1)}%` },
      { label: "Undercut countered by rival undercut on same lap", value: `${rng(8, 18, 1)}%` },
    ],
    confidence: rng(80, 93, 0),
    nextActions: [
      {
        label: "Apply rear-grip bias setup",
        description: "Increase rear spring preload by 2 clicks, soften rear compression 1 click for T15 exit drive.",
        cta: "Apply Setup",
      },
      {
        label: "Simulate undercut lap 4–5",
        description: "Run strategy simulation with undercut on lap 4 vs. lap 5. Determine optimal call.",
        cta: "Simulate",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 5. Data Cube — Misano
// ---------------------------------------------------------------------------

export function dataCubeData(): ModuleDemoData {
  const circuit = getCircuit("misano");
  const riderRef = pick(["Rider #1", "Rider #63", "Rider #93", "Rider #89"]);
  return {
    moduleId: "data-cube",
    status: "operational",
    summary: `Multi-dimensional analysis cube over ${circuit.name}. Slice: rider × sector × tyre compound × lap number. Pre-built query presets surface grip fade patterns, rider deltas, and tyre crossover points.`,
    metrics: [
      {
        label: "Cube Dimensions",
        value: "4",
        sub: "Rider × Sector × Tyre × Lap",
        accent: "neutral",
        trend: "stable",
      },
      {
        label: "Slice Count",
        value: `${rng(240, 480, 0)}`,
        sub: `${rng(8, 14, 0)} riders × 3 sectors × 4 compounds × ${rng(3, 8, 0)} laps`,
        accent: "neutral",
        trend: "up",
      },
      {
        label: "Grip Fade — Medium Tyre",
        value: `–${rng(2.1, 4.8, 1)}%`,
        sub: `lap ${rng(6, 10, 0)} → ${rng(15, 22, 0)}`,
        accent: "warning",
        trend: "down",
      },
      {
        label: "Best Rider Delta",
        value: `+${rng(0.05, 0.45, 3)} s`,
        sub: `${riderRef} vs. session best`,
        accent: pick(ACCENTS),
        trend: pick(TRENDS),
      },
    ],
    decision: {
      title: "Switch tyre compound based on crossover analysis?",
      recommendation: `Medium rear grip fade exceeds −3.5% at lap ${rng(6, 10, 0)}. The soft-medium crossover is at lap ${rng(7, 12, 0)}. If qualifying on medium, consider soft for race start with lap-5 swap. Data cube shows +0.15 s/lap benefit for first 6 laps on soft.`,
      impact: "+0.15 s/lap (laps 1–6) | crossover loss at lap 7–8 — net +0.08 s/lap race average",
      confidence: rng(82, 93, 0),
      urgency: "medium",
      actionLabel: "Recommend Soft Start",
    },
    evidence: [
      {
        label: "Sector Grip Fade Delta",
        value: `S3 –${rng(2.8, 5.2, 1)}% (worst)`,
        source: "Tyre-model cube slice",
        type: "model",
      },
      {
        label: "Rider Sector Strength",
        value: `${riderRef}: S2 best, S3 weakest (+${rng(0.08, 0.22, 3)} s)`,
        source: "Sector timing decoders",
        type: "sensor",
      },
      {
        label: "Crossover Lap — Soft → Medium",
        value: `Lap ${rng(7, 12, 0)}`,
        source: "Historical compound matrix",
        type: "historical",
      },
      {
        label: "Rival Compound Choice",
        value: pick(["Soft (3 riders)", "Medium (5 riders)", "Hard (1 rider)", "Mixed front/rear"]),
        source: "Paddock intelligence feed",
        type: "comms",
      },
    ],
    risks: [
      { label: "Soft tyre graining before crossover", value: `${rng(10, 22, 1)}%` },
      { label: "Cube data stale — track evolution invalidates slice", value: `${rng(5, 15, 1)}%` },
    ],
    confidence: rng(80, 92, 0),
    nextActions: [
      {
        label: "Recommend soft-start strategy",
        description: "Brief rider on soft-medium strategy with lap-7 crossover window. Confirm tyre allocation.",
        cta: "Brief Rider",
      },
      {
        label: "Refresh cube with FP2 data",
        description: "Import FP2 telemetry to re-calibrate grip fade model and crossover lap.",
        cta: "Refresh Cube",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 6. Championship — Valencia (season finale context)
// ---------------------------------------------------------------------------

export function championshipData(): ModuleDemoData {
  const circuit = getCircuit("valencia");
  const riderA = pick(["Rider #1 — Pecco", "Rider #89 — Jorge", "Rider #93 — Marc", "Rider #63 — Enea"]);
  const riderB = pick(["Rider #1 — Pecco", "Rider #89 — Jorge", "Rider #93 — Marc", "Rider #63 — Enea"]);
  const pointsGap = rng(1, 37, 0);
  return {
    moduleId: "championship",
    status: "operational",
    summary: `Championship scenario engine for ${circuit.name} — season finale. Points analysis, rival pressure index, risk/reward for every strategy call, and race-outcome probability matrix.`,
    metrics: [
      {
        label: "Points Gap (Top 2)",
        value: `${pointsGap} pts`,
        sub: `${riderA} → ${riderB}`,
        accent: pointsGap <= 5 ? "critical" : pointsGap <= 15 ? "warning" : "neutral",
        trend: "stable",
      },
      {
        label: "Rival Pressure Index",
        value: `${rng(45, 95, 0)}%`,
        sub: `podium contenders within ${rng(2, 12, 0)} pts`,
        accent: pick(ACCENTS),
        trend: pick(TRENDS),
      },
      {
        label: "Win Probability",
        value: `${rng(12, 68, 0)}%`,
        sub: `based on current form + circuit history`,
        accent: pick(ACCENTS),
        trend: pick(TRENDS),
      },
      {
        label: "Podium Secures Title",
        value: pick(["Yes", "Yes", "Yes", "No — need win", "No — need P2 or better"]) as string,
        sub: `if ${riderA} finishes ahead of ${riderB}`,
        accent: "critical",
        trend: "stable",
      },
    ],
    decision: {
      title: "Conservative race or fight for win?",
      recommendation: `${riderA} leads ${riderB} by ${pointsGap} pts. A P4 finish is sufficient for the title IF ${riderB} does not win. Risk/reward: fighting for the win with a 15% crash probability vs. conservative P3–P4 with 2% crash probability. Recommended: conservative, cover ${riderB} in the early laps.`,
      impact: `Crash risk reduced from 15% to 2% | title probability at P3-P4: ${rng(82, 94, 0)}%`,
      confidence: rng(80, 95, 0),
      urgency: "high",
      actionLabel: "Set Conservative Plan",
    },
    evidence: [
      {
        label: "Title Scenarios Solved",
        value: `${rng(90, 128, 0)}`,
        source: "Championship engine v5.2",
        type: "model",
      },
      {
        label: "Rider Head-to-Head (Season)",
        value: `${riderA}: ${rng(6, 12, 0)} wins — ${riderB}: ${rng(3, 9, 0)} wins`,
        source: "Season statistics DB",
        type: "historical",
      },
      {
        label: "Circuit Form — Last 3 Races",
        value: `${riderA}: P${pick(["1","2","3","4","5"])} | ${riderB}: P${pick(["1","2","3","4","5","DNF"])}`,
        source: "Race results API",
        type: "external",
      },
      {
        label: "Rider Comms — Stress Level",
        value: pick(["Calm", "Focused", "Tense", "Over-confident", "Nervous"]),
        source: "Team radio transcript analysis",
        type: "comms",
      },
    ],
    risks: [
      { label: "Rider ignores conservative plan, fights and crashes", value: `${rng(10, 25, 1)}%` },
      { label: "Rival wins from outside top 5 (points swing exceeds gap)", value: `${rng(4, 14, 1)}%` },
    ],
    confidence: rng(82, 94, 0),
    nextActions: [
      {
        label: "Brief rider — conservative strategy",
        description: `Communicate P3–P4 target. Cover ${riderB}. Do not engage in wheel-to-wheel with title rival.`,
        cta: "Brief Rider",
      },
      {
        label: "Simulate rival scenarios",
        description: "Run 500 Monte Carlo simulations with variable pit-stop timing and safety-car probability.",
        cta: "Run Monte Carlo",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 7. Track Live — Portimão
// ---------------------------------------------------------------------------

export function trackLiveData(): ModuleDemoData {
  const circuit = getCircuit("portimao");
  const activeSectors = [`S1: ${pick(["Green", "Green", "Green", "Yellow", "Green"])}`, `S2: ${pick(["Green", "Green", "Yellow", "Green"])}`, `S3: ${pick(["Green", "Green", "Green", "Red", "Yellow"])}`];
  return {
    moduleId: "track-live",
    status: "operational",
    summary: `Live session board for ${circuit.name}. Real-time track state: sector flags, current grip index, wind vector, ambient/track temps, and rider delta-to-best live feed.`,
    metrics: [
      {
        label: "Track Temp",
        value: `${rng(28, 48, 0)} °C`,
        sub: `ambient ${rng(circuit.avgTempC - 5, circuit.avgTempC + 8, 0)} °C`,
        accent: "neutral",
        trend: pick(TRENDS),
      },
      {
        label: "Wind",
        value: `${rng(5, 28, 0)} km/h`,
        sub: pick(["Headwind S1", "Tailwind S3", "Crosswind S2", "Variable"]) as string,
        accent: pick(ACCENTS),
        trend: pick(TRENDS),
      },
      {
        label: "Current Grip Index",
        value: `${rng(75, 88, 1)}%`,
        sub: `${pick(["+", "–"])}${rng(0.3, 2.1, 1)}%/lap`,
        accent: pick(ACCENTS),
        trend: pick(TRENDS),
      },
      {
        label: "Rider Delta",
        value: `${pick(["+0.084", "+0.231", "–0.147", "+0.512", "–0.063"])} s`,
        sub: "to session best (live)",
        accent: pick(ACCENTS),
        trend: pick(TRENDS),
      },
    ],
    decision: {
      title: "Signal rider to pit for rear tyre change?",
      recommendation: `Grip index down ${rng(1.2, 2.8, 1)}% in 2 laps — degradation accelerating. Rear tyre surface temp ${rng(108, 122, 0)} °C, above optimal window. Pit this lap for fresh rear. Over-cutting rival #${Math.floor(rng(20, 99, 0))} who pitted last lap.`,
      impact: "+0.25 s/lap recovery | over-cut gains estimated 2.1 s track position",
      confidence: rng(78, 92, 0),
      urgency: "high",
      actionLabel: "Call Pit — Rear",
    },
    evidence: [
      {
        label: "Live Rear Tyre Temp",
        value: `${rng(108, 122, 0)} °C`,
        source: "TPMS sensor array",
        type: "sensor",
      },
      {
        label: "Degradation Rate (Live)",
        value: `–${rng(1.5, 3.2, 1)}%/lap`,
        source: "Live tyre model",
        type: "model",
      },
      {
        label: "Rival Pit Status",
        value: pick(["#93 pitted (lap 5)", "#63 pitted (lap 6)", "#89 in pit window", "#1 staying out"]),
        source: "Pit-lane loop transponder",
        type: "external",
      },
      {
        label: "Sector Flag Status",
        value: activeSectors.join(" | "),
        source: "Race control data feed",
        type: "comms",
      },
    ],
    risks: [
      { label: "Rival undercuts while we wait one more lap", value: `${rng(10, 22, 1)}%` },
      { label: "Rear tyre graining before pit entry", value: `${rng(6, 16, 1)}%` },
    ],
    confidence: rng(80, 92, 0),
    nextActions: [
      {
        label: "Call rider to pit",
        description: "Signal PIT BOARD this lap for rear tyre change. Crew prepped with soft compound.",
        cta: "Signal Pit",
      },
      {
        label: "Monitor over-cut delta",
        description: "Track over-cut time vs. #93 once rider exits pit lane with fresh rubber.",
        cta: "Monitor Delta",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 8. Lap Replay — Sachsenring
// ---------------------------------------------------------------------------

export function lapReplayData(): ModuleDemoData {
  const circuit = getCircuit("sachsenring");
  const lapTimeStr = lapTime(78, 12);
  return {
    moduleId: "lap-replay",
    status: "operational",
    summary: `Lap replay analyser for ${circuit.name}. Annotated timeline of a timed lap: sector splits, braking/throttle/corner events, gear shifts, and AI-generated commentary on rider technique.`,
    metrics: [
      {
        label: "Lap Time",
        value: lapTimeStr,
        sub: `S1: ${rng(24, 28, 3)} s | S2: ${rng(33, 38, 3)} s | S3: ${rng(17, 21, 3)} s`,
        accent: pick(ACCENTS),
        trend: "stable",
      },
      {
        label: "Max Speed",
        value: `${rng(289, 318, 0)} km/h`,
        sub: `${pick(["T1 exit", "T13 entry", "T10 exit"])}`,
        accent: "neutral",
        trend: "stable",
      },
      {
        label: "Braking Events",
        value: `${rng(8, 13, 0)}`,
        sub: `avg decel ${rng(1.12, 1.38, 2)} G`,
        accent: "neutral",
        trend: "stable",
      },
      {
        label: "Min Corner Speed",
        value: `${rng(58, 78, 0)} km/h`,
        sub: `${pick(["T11 — Qu alle", "T1 — Wasserwerk", "T8 — Foxhole"])}`,
        accent: pick(ACCENTS),
        trend: "stable",
      },
    ],
    decision: {
      title: "Mark T8 entry as improvement zone?",
      recommendation: `Rider lost ${rng(0.08, 0.18, 2)} s at T8 (Foxhole) entry — late trail-brake onset by ${rng(5, 12, 0)} m vs. reference. Coaching point: initiate brake 5 m earlier, maintain 3% more rear brake pressure for rear squat stability.`,
      impact: "Projected –0.12 s/lap with T8 entry fix alone | cumulative −0.22 s with T11 exit adjustment",
      confidence: rng(78, 90, 0),
      urgency: "medium",
      actionLabel: "Flag T8 Entry",
    },
    evidence: [
      {
        label: "T8 Entry Speed",
        value: `${rng(108, 132, 0)} km/h`,
        source: "GPS data logger — 10 Hz",
        type: "sensor",
      },
      {
        label: "Braking Onset Point",
        value: `${pick(["Standard", "Late (−8 m)", "Early (+4 m)", "Late (−12 m)"])}`,
        source: "Braking analytics model",
        type: "model",
      },
      {
        label: "Gear Shift Pattern",
        value: `6→5→4→3→4→5→6 (lap average)`,
        source: "Gearbox telemetry channel",
        type: "sensor",
      },
      {
        label: "Reference Line — Best Lap",
        value: pick(["1:19.423 (Márquez 2024)", "1:19.500 (Bagnaia 2024)", "1:19.812 (Martin 2024)"]),
        source: "Circuit reference library",
        type: "historical",
      },
    ],
    risks: [
      { label: "Rider over-corrects and loses flow through T9–T11", value: `${rng(8, 20, 1)}%` },
      { label: "Grip conditions changed since reference lap", value: `${rng(12, 25, 1)}%` },
    ],
    confidence: rng(80, 92, 0),
    nextActions: [
      {
        label: "Send coaching note to rider",
        description: "Video annotation: T8 braking onset 5 m earlier, maintain rear brake pressure. Embedded side-by-side reference.",
        cta: "Send Coaching",
      },
      {
        label: "Compare with FP1 telemetry",
        description: "Cross-reference T8 pattern across all rider laps in FP1 to confirm systematic issue.",
        cta: "Compare Laps",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 9. Platform — Global Console (not circuit-specific)
// ---------------------------------------------------------------------------

export function platformData(): ModuleDemoData {
  const allModules = [
    "track-evolution", "track-surface", "event-engine", "circuit-history",
    "data-cube", "championship", "track-live", "lap-replay",
    "autonomous-engineer", "oracle-pit-wall",
  ];
  const onlineCount = rng(8, allModules.length, 0);
  const degradedCount = allModules.length - onlineCount;
  return {
    moduleId: "platform",
    status: "operational",
    summary: "Central platform services console. Aggregate health of all circuit-intelligence and pit-wall modules, deployment pipeline status, data freshness SLAs, and cross-module integration status.",
    metrics: [
      {
        label: "Modules Online",
        value: `${onlineCount}/${allModules.length}`,
        sub: degradedCount > 0 ? `${degradedCount} degraded` : "All nominal",
        accent: degradedCount > 0 ? "warning" : "positive",
        trend: "stable",
      },
      {
        label: "Data Freshness",
        value: `${rng(0.5, 12, 1)} s ago`,
        sub: "last telemetry ingress",
        accent: "neutral",
        trend: "stable",
      },
      {
        label: "API Uptime (30d)",
        value: `${rng(99.2, 99.98, 2)}%`,
        sub: `last incident ${rng(2, 28, 0)}d ago`,
        accent: "positive",
        trend: "up",
      },
      {
        label: "Queue Depth",
        value: `${rng(0, 24, 0)} msgs`,
        sub: `${pick(["Kafka", "RabbitMQ", "NATS"])} bus`,
        accent: rng(0, 1, 0) >= 0.5 ? "neutral" : "warning",
        trend: "stable",
      },
    ],
    decision: {
      title: "Roll out v5.3 circuit-model update to all modules?",
      recommendation: `Platform v5.3 includes the updated grip-degradation model with improved humidity correction (RMS error −12%). All staging tests pass. Deploy to production during next pit window (session gap). Rolling restart: zero-downtime via blue-green.`,
      impact: "Model RMS error reduced from 0.18 s to 0.16 s | deploy window: 4 min 20 s",
      confidence: rng(88, 96, 0),
      urgency: "medium",
      actionLabel: "Deploy v5.3",
    },
    evidence: [
      {
        label: "Staging Test Results",
        value: "14/14 passed",
        source: "CI pipeline #4821",
        type: "external",
      },
      {
        label: "Module Dependencies",
        value: `${pick(["All green", "1 blocking (data-cube)", "2 warnings", "Clean"])}`,
        source: "Dependency graph scanner",
        type: "model",
      },
      {
        label: "Deploy Window",
        value: `${pick(["20 min (session gap)", "35 min (night window)", "Available now", "15 min (between sessions)"])}`,
        source: "Session scheduling API",
        type: "comms",
      },
      {
        label: "Active Integrations",
        value: `${rng(8, 16, 0)} upstream services connected`,
        source: "Service mesh registry",
        type: "sensor",
      },
    ],
    risks: [
      { label: "Rollback required — v5.3 regression on data-cube", value: `${rng(4, 12, 1)}%` },
      { label: "Deploy window overruns into green-flag session", value: `${rng(3, 10, 1)}%` },
    ],
    confidence: rng(84, 95, 0),
    nextActions: [
      {
        label: "Approve v5.3 deployment",
        description: "Deploy to production via blue-green. Monitor rollback health check for 2 min after cut-over.",
        cta: "Approve Deploy",
      },
      {
        label: "Validate data-cube post-deploy",
        description: "Run data-cube integrity check against pre-deploy baseline to confirm no regression.",
        cta: "Validate",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Convenience exports
// ---------------------------------------------------------------------------

export { CIRCUITS, rng, pick, lapTime, getCircuit };
