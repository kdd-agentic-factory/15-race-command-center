// =============================================================================
// RCC Module Demo Data — Typed factory functions for the 15 Race Command Center modules
// All numbers reflect realistic MotoGP™ telemetry, timing, and engineering values.
// =============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ModuleMetric {
  label: string;
  value: string;
  sub?: string;
  accent?: "neutral" | "positive" | "warning" | "critical";
  trend?: "up" | "down" | "stable";
}

export interface ModuleDecision {
  title: string;
  recommendation: string;
  impact: string;
  confidence: number;
  urgency: "low" | "medium" | "high" | "critical";
  actionLabel: string;
}

export interface ModuleEvidence {
  label: string;
  value: string;
  source?: string;
  type?: "sensor" | "model" | "external" | "comms" | "historical";
}

export interface ModuleRiskItem {
  label: string;
  value: string;
}

export interface ModuleAction {
  label: string;
  description: string;
  cta: string;
}

export interface ModuleDemoData {
  moduleId: string;
  status: "operational";
  metrics: ModuleMetric[];
  decision: ModuleDecision;
  evidence: ModuleEvidence[];
  risks: ModuleRiskItem[];
  confidence: number;
  nextActions: ModuleAction[];
  summary: string;
}

// ---------------------------------------------------------------------------
// Helpers
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

// ---------------------------------------------------------------------------
// 1. Autonomous Engineer
// ---------------------------------------------------------------------------

export function autonomousEngineerData(): ModuleDemoData {
  return {
    moduleId: "autonomous-engineer",
    status: "operational",
    summary:
      "Autonomous engineering agent continuously optimising bike setup across suspension, geometry, and electronics maps using real-time track and telemetry feedback.",
    metrics: [
      {
        label: "Setup Iterations",
        value: "347",
        sub: "this session",
        accent: "neutral",
        trend: "up",
      },
      {
        label: "Optimal Found",
        value: "94.2%",
        sub: "convergence score",
        accent: "positive",
        trend: "up",
      },
      {
        label: "Avg Lap Improvement",
        value: "0.284s",
        sub: "per optimisation cycle",
        accent: "positive",
        trend: "up",
      },
      {
        label: "Rejected Configs",
        value: "52",
        sub: "flagged as unsafe",
        accent: "warning",
        trend: "stable",
      },
    ],
    decision: {
      title: "Switch to asymmetric rear-spring preload?",
      recommendation:
        "Deploy asymmetric rear-spring preload (+2 clicks RH) based on sector-3 left-hand bias. Simulation predicts 0.12 s/lap gain with no stability penalty.",
      impact: "–0.12 s/lap projected | tyre wear delta within ±0.5 °C",
      confidence: 91,
      urgency: "medium",
      actionLabel: "Deploy Asymmetric Preload",
    },
    evidence: [
      {
        label: "Sector-3 Left-Hand Bias",
        value: "63.7%",
        source: "Corner-analytics model v2.8",
        type: "model",
      },
      {
        label: "Current Rear Preload",
        value: "28 clicks (sym)",
        source: "Suspension telemetry",
        type: "sensor",
      },
      {
        label: "Projected Grip Delta",
        value: "+4.2 Nm/°",
        source: "Tyre-model simulation",
        type: "model",
      },
      {
        label: "Stability Margin",
        value: "1.28 G (safe)",
        source: "Dynamic-load envelope",
        type: "model",
      },
    ],
    risks: [
      { label: "Corner-entry understeer", value: "6.2%" },
      { label: "Rear chatter onset", value: "3.8%" },
    ],
    confidence: 91,
    nextActions: [
      {
        label: "Approve asymmetric preload",
        description: "Apply +2 clicks RH rear preload and validate over 3 out-laps.",
        cta: "Deploy",
      },
      {
        label: "Review rejected configs",
        description: "Inspect 52 flagged configurations for potential safe-edge candidates.",
        cta: "Review",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 2. Oracle Pit Wall
// ---------------------------------------------------------------------------

export function oraclePitWallData(): ModuleDemoData {
  return {
    moduleId: "oracle-pit-wall",
    status: "operational",
    summary:
      "Predictive pit-wall intelligence fusing live weather radar, track-state models, and rival pit windows to recommend optimal stop timing.",
    metrics: [
      {
        label: "Rain Probability",
        value: "68%",
        sub: "in next 18 min",
        accent: "warning",
        trend: "up",
      },
      {
        label: "Pit Window Open",
        value: "Lap 9 – 14",
        sub: "optimal splash & go",
        accent: "neutral",
        trend: "stable",
      },
      {
        label: "Rival Stops Predicted",
        value: "7",
        sub: "next 3 laps",
        accent: "neutral",
        trend: "up",
      },
      {
        label: "Track Grip Index",
        value: "87.3%",
        sub: "falling –1.2%/lap",
        accent: "warning",
        trend: "down",
      },
    ],
    decision: {
      title: "Box this lap for wets?",
      recommendation:
        "Radar shows precip cell 12 km out, ETA 4 min. Box at end of current lap for wets. Staying out risks a damp-track crash when rain arrives.",
      impact: "+18.3 s box loss vs. –2.4 s/lap wet-speed gain (break-even lap 8)",
      confidence: 86,
      urgency: "critical",
      actionLabel: "Call Box — Wets",
    },
    evidence: [
      {
        label: "Rain Cell Distance",
        value: "12.4 km",
        source: "DTN Weather Fusion",
        type: "external",
      },
      {
        label: "Cell ETA",
        value: "3 min 52 s",
        source: "Radar mosaic model",
        type: "model",
      },
      {
        label: "Track Temp Delta",
        value: "–8 °C (34 → 26)",
        source: "Infrared track loops",
        type: "sensor",
      },
      {
        label: "Rival #93 Pit Window",
        value: "Laps 10–12",
        source: "Pit-monitor feed",
        type: "external",
      },
      {
        label: "Wet-Lap Delta Historical",
        value: "–1.8 s vs. dry",
        source: "Session history DB",
        type: "historical",
      },
    ],
    risks: [
      { label: "Rain misses circuit entirely", value: "18.0%" },
      { label: "Under-cut from rival pitting same lap", value: "14.5%" },
    ],
    confidence: 86,
    nextActions: [
      {
        label: "Box this lap — wets",
        description: "Call rider in. Pit crew prepped for full wet change.",
        cta: "Call Box",
      },
      {
        label: "Hold and re-evaluate",
        description: "Re-check radar at start-finish line before committing.",
        cta: "Hold",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 3. Race Control
// ---------------------------------------------------------------------------

export function raceControlData(): ModuleDemoData {
  return {
    moduleId: "race-control",
    status: "operational",
    summary:
      "Centralised flag management, incident detection, and track-limits enforcement feeding directly into Race Direction data streams.",
    metrics: [
      {
        label: "Track Limits Violations",
        value: "14",
        sub: "3 riders > 5 strikes",
        accent: "warning",
        trend: "up",
      },
      {
        label: "Incidents Flagged",
        value: "3",
        sub: "2 reviewed, 1 open",
        accent: "critical",
        trend: "stable",
      },
      {
        label: "Flag Status",
        value: "Green",
        sub: "sector 4 double-yellow cleared",
        accent: "positive",
        trend: "down",
      },
      {
        label: "Steward Decisions",
        value: "1.2 s",
        sub: "avg response latency",
        accent: "neutral",
        trend: "stable",
      },
    ],
    decision: {
      title: "Refer T3 contact to stewards?",
      recommendation:
        "Rider #73 made aggressive pass on #41 at Turn 3 — rear contact. Auto-clip reviewed. Recommend referral: potential 1-position grid-drop penalty.",
      impact: "1-position grid penalty if upheld | #41 damage minimal",
      confidence: 94,
      urgency: "high",
      actionLabel: "Refer to Stewards",
    },
    evidence: [
      {
        label: "Contact Speed Delta",
        value: "14.2 km/h",
        source: "GPS transponder data",
        type: "sensor",
      },
      {
        label: "Impact G-Force",
        value: "3.8 G (rear)",
        source: "IMU telemetry",
        type: "sensor",
      },
      {
        label: "Video Clip",
        value: "T3 onboard + heli",
        source: "Broadcast ISO feed",
        type: "external",
      },
      {
        label: "Track Limits #73",
        value: "6 strikes (penalty)",
        source: "FIM timing system",
        type: "external",
      },
    ],
    risks: [
      { label: "Referral rejected — no penalty", value: "22.0%" },
      { label: "Rider #41 DNF from damage", value: "8.5%" },
    ],
    confidence: 94,
    nextActions: [
      {
        label: "Submit incident report",
        description: "Package telemetry and video for Race Direction review.",
        cta: "Submit",
      },
      {
        label: "Flag #73 for monitoring",
        description: "Set track-limits and aggression alerts to high sensitivity.",
        cta: "Flag",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 4. Edge Hub
// ---------------------------------------------------------------------------

export function edgeHubData(): ModuleDemoData {
  return {
    moduleId: "edge-hub",
    status: "operational",
    summary:
      "On-track edge computing gateway ingesting, normalising, and forwarding 1 200+ telemetry channels with sub-5 ms jitter to the command-centre data fabric.",
    metrics: [
      {
        label: "Data Throughput",
        value: "187 Mbps",
        sub: "aggregate TX",
        accent: "neutral",
        trend: "up",
      },
      {
        label: "Packet Loss",
        value: "0.03%",
        sub: "48 h rolling",
        accent: "positive",
        trend: "down",
      },
      {
        label: "Channel Count",
        value: "1 248",
        sub: "248 active riders",
        accent: "neutral",
        trend: "stable",
      },
      {
        label: "Avg Latency",
        value: "3.7 ms",
        sub: "edge → cloud",
        accent: "positive",
        trend: "stable",
      },
    ],
    decision: {
      title: "Throttle telemetry to conserve upstream bandwidth?",
      recommendation:
        "Rider session count dropped to 12 (from 22). Reduce redundant GPS + IMU channels from 8 Hz to 4 Hz. Upstream bandwidth drops 34% with no data-loss risk.",
      impact: "–34% bandwidth | data-loss risk < 0.01%",
      confidence: 98,
      urgency: "low",
      actionLabel: "Apply Throttle",
    },
    evidence: [
      {
        label: "Active Riders",
        value: "12 / 22",
        source: "Session roster",
        type: "external",
      },
      {
        label: "Bandwidth Headroom",
        value: "23 Mbps",
        source: "Edge gateway monitor",
        type: "sensor",
      },
      {
        label: "Channel Redundancy",
        value: "GPS (×3) / IMU (×2)",
        source: "Config manifest",
        type: "model",
      },
      {
        label: "Downsample Cost",
        value: "0.003% data loss (sim)",
        source: "Ingestion simulator",
        type: "model",
      },
    ],
    risks: [
      { label: "Unexpected session growth", value: "4.5%" },
      { label: "Config rollback time", value: "12 s" },
    ],
    confidence: 98,
    nextActions: [
      {
        label: "Apply 4 Hz throttle",
        description: "Reduce GPS/IMU to 4 Hz. Monitor for 5 minutes post-change.",
        cta: "Apply",
      },
      {
        label: "Verify rollback procedure",
        description: "Confirm one-click revert to 8 Hz is tested and documented.",
        cta: "Check",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 5. Data Lakehouse
// ---------------------------------------------------------------------------

export function dataLakehouseData(): ModuleDemoData {
  return {
    moduleId: "data-lakehouse",
    status: "operational",
    summary:
      "Unified data lakehouse storing all session telemetry, with automated hot/warm/cold tiering and SQL-point queries averaging 340 ms p99.",
    metrics: [
      {
        label: "Storage Volume",
        value: "273 TB",
        sub: "session archives",
        accent: "neutral",
        trend: "up",
      },
      {
        label: "Avg Query Time",
        value: "128 ms",
        sub: "p99: 340 ms",
        accent: "positive",
        trend: "down",
      },
      {
        label: "Cold Tier",
        value: "187 TB",
        sub: "68 % of total",
        accent: "neutral",
        trend: "up",
      },
      {
        label: "Ingestion Rate",
        value: "18.4 GB/h",
        sub: "live race weekend",
        accent: "neutral",
        trend: "stable",
      },
    ],
    decision: {
      title: "Archive pre-season sessions to cold tier?",
      recommendation:
        "Pre-season data (24 sessions, 31 TB) accessed 0 times in 12 weeks. Move to cold storage (Glacier) saving $4 200/mo. Restore SLA: 12 hours.",
      impact: "–$4 200/mo storage cost | 12 h restore SLA accepted",
      confidence: 97,
      urgency: "low",
      actionLabel: "Archive to Cold",
    },
    evidence: [
      {
        label: "Pre-season Access Count",
        value: "0 (12 weeks)",
        source: "Query audit log",
        type: "model",
      },
      {
        label: "Current Hot-Tier Cost",
        value: "$6 800/mo",
        source: "Cost explorer",
        type: "external",
      },
      {
        label: "Cold-Tier Projected Cost",
        value: "$2 600/mo",
        source: "Tier-calculator model",
        type: "model",
      },
      {
        label: "Restore SLA",
        value: "12 h (99.9 %)",
        source: "Provider contract",
        type: "external",
      },
    ],
    risks: [
      { label: "Unexpected pre-season replay request", value: "12.0%" },
      { label: "Restore failure (corrupt archive)", value: "0.4%" },
    ],
    confidence: 97,
    nextActions: [
      {
        label: "Execute cold archive",
        description: "Move 31 TB of pre-season data to Glacier. Confirm start.",
        cta: "Execute",
      },
      {
        label: "Verify archive integrity",
        description: "Run checksum validation on 5 % random sample before deletion.",
        cta: "Verify",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 6. Data Trust
// ---------------------------------------------------------------------------

export function dataTrustData(): ModuleDemoData {
  return {
    moduleId: "data-trust",
    status: "operational",
    summary:
      "Data-governance layer tracking lineage, quality scores, and compliance for every telemetry signal fed into decision models and AI agents.",
    metrics: [
      {
        label: "Data Quality Score",
        value: "98.7%",
        sub: "rolling 24 h",
        accent: "positive",
        trend: "up",
      },
      {
        label: "Lineage Coverage",
        value: "100%",
        sub: "all hot-path signals",
        accent: "positive",
        trend: "stable",
      },
      {
        label: "Anomalies Detected",
        value: "3",
        sub: "2 resolved, 1 open",
        accent: "warning",
        trend: "down",
      },
      {
        label: "Compliance OK",
        value: "17 / 17",
        sub: "GDPR + FIM data policy",
        accent: "positive",
        trend: "stable",
      },
    ],
    decision: {
      title: "Flag IMU channel #112 as degraded?",
      recommendation:
        "Front-IMU yaw signal shows 11 % dropped frames over 90 min. Degraded-data tag recommended. Downstream models (TC-slip, wheelie) will use interpolated fallback.",
      impact: "0.4 % model accuracy loss until sensor replacement",
      confidence: 89,
      urgency: "medium",
      actionLabel: "Flag as Degraded",
    },
    evidence: [
      {
        label: "Drop Rate (IMU #112)",
        value: "11.3 %",
        source: "Frame-integrity monitor",
        type: "sensor",
      },
      {
        label: "Time Since First Drop",
        value: "92 min",
        source: "Anomaly time-series DB",
        type: "model",
      },
      {
        label: "Downstream Consumers",
        value: "TC, Wheelie, Launch Ctrl",
        source: "Lineage graph",
        type: "model",
      },
      {
        label: "Fallback Accuracy",
        value: "99.6%",
        source: "Interpolation benchmark",
        type: "model",
      },
    ],
    risks: [
      { label: "False positive — sensor healthy", value: "5.0%" },
      { label: "Interpolation drift over time", value: "3.2%" },
    ],
    confidence: 89,
    nextActions: [
      {
        label: "Flag IMU #112 degraded",
        description: "Tag signal. Downstream models switch to interpolation fallback.",
        cta: "Flag",
      },
      {
        label: "Schedule sensor replacement",
        description: "Notify crew for front-IMU swap at end of session.",
        cta: "Schedule",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 7. Human Performance
// ---------------------------------------------------------------------------

export function humanPerformanceData(): ModuleDemoData {
  return {
    moduleId: "human-performance",
    status: "operational",
    summary:
      "Rider biometric monitoring fusing heart-rate variability, core temperature, hydration, and fatigue metrics to optimise physical readiness.",
    metrics: [
      {
        label: "Heart Rate",
        value: "168 bpm",
        sub: "avg over stint",
        accent: "neutral",
        trend: "stable",
      },
      {
        label: "Core Temp",
        value: "38.4 °C",
        sub: "+0.6 °C baseline",
        accent: "warning",
        trend: "up",
      },
      {
        label: "Hydration Loss",
        value: "2.3 %",
        sub: "since session start",
        accent: "warning",
        trend: "up",
      },
      {
        label: "Fatigue Index",
        value: "37/100",
        sub: "moderate – 22 laps done",
        accent: "neutral",
        trend: "up",
      },
    ],
    decision: {
      title: "Recommend cooldown lap and hydration?",
      recommendation:
        "Core temp rising above 38.2 °C threshold and hydration loss at 2.3 % (approaching 3 % impairment zone). Recommend 1 cooldown lap + electrolyte intake before next run.",
      impact: "–2 min track time vs. –0.18 s/lap cognitive impairment avoided",
      confidence: 87,
      urgency: "high",
      actionLabel: "Call Cool-down Lap",
    },
    evidence: [
      {
        label: "Core Temp Trend",
        value: "+0.6 °C / 30 min",
        source: "Gilford ingestible pill",
        type: "sensor",
      },
      {
        label: "HRV",
        value: "52 ms (↓12 %)",
        source: "Polar chest strap",
        type: "sensor",
      },
      {
        label: "Sweat Rate",
        value: "1.4 L/h",
        source: "Preedicted model + scale",
        type: "model",
      },
      {
        label: "Cognitive Impairment Threshold",
        value: "3 % dehydration",
        source: "ACSM guidelines",
        type: "historical",
      },
    ],
    risks: [
      { label: "Heat stress / heat exhaustion", value: "8.0%" },
      { label: "Performance drop > 0.3 s/lap", value: "12.0%" },
    ],
    confidence: 87,
    nextActions: [
      {
        label: "Call cool-down lap",
        description: "Instruct rider to take 1 easy lap with hydration at pit entry.",
        cta: "Call",
      },
      {
        label: "Prepare ice vest",
        description: "Have cooling vest ready for rider return to pit box.",
        cta: "Prep",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 8. Engineering Control
// ---------------------------------------------------------------------------

export function engineeringControlData(): ModuleDemoData {
  return {
    moduleId: "engineering-control",
    status: "operational",
    summary:
      "Real-time parameter control surface for engine-brake mapping, traction-control intervention, and power-delivery curves — all adjustable live from pit wall.",
    metrics: [
      {
        label: "Engine Brake",
        value: "7 / 12",
        sub: "current map step",
        accent: "neutral",
        trend: "down",
      },
      {
        label: "TC Intervention",
        value: "23 %",
        sub: "avg slip reduction",
        accent: "positive",
        trend: "stable",
      },
      {
        label: "Power Mode",
        value: "Map C",
        sub: "mid-range emphasis",
        accent: "neutral",
        trend: "stable",
      },
      {
        label: "Wheelie Ctrl",
        value: "8.4 %",
        sub: "lift reduction",
        accent: "positive",
        trend: "up",
      },
    ],
    decision: {
      title: "Reduce engine-brake to level 5 for corner-entry stability?",
      recommendation:
        "Rider reports rear instability on corner entry (T2, T7). Reduce engine-brake from 7 → 5. Simulation shows –0.08 s lap gain with no engine-over-run penalty.",
      impact: "–0.08 s/lap | rear-slip RMS reduced 14 %",
      confidence: 88,
      urgency: "medium",
      actionLabel: "Set EB → 5",
    },
    evidence: [
      {
        label: "Rear Slip RMS (T2)",
        value: "8.7 %",
        source: "Chassis accelerometer",
        type: "sensor",
      },
      {
        label: "Rear Slip RMS (T7)",
        value: "9.1 %",
        source: "Chassis accelerometer",
        type: "sensor",
      },
      {
        label: "Engine-Over-Run Margin",
        value: "1 200 RPM safe",
        source: "ECU log",
        type: "sensor",
      },
      {
        label: "Lap-Gain Prediction",
        value: "–0.08 s",
        source: "Lap-sim model v3.1",
        type: "model",
      },
    ],
    risks: [
      { label: "Excessive engine braking (rear hop)", value: "4.0%" },
      { label: "Rider adaptation time > 2 laps", value: "10.0%" },
    ],
    confidence: 88,
    nextActions: [
      {
        label: "Set EB to 5",
        description: "Deploy engine-brake level 5. Confirm rider feedback after 2 laps.",
        cta: "Deploy",
      },
      {
        label: "Monitor rear-slip RMS",
        description: "Watch T2/T7 rear-slip values for confirmation of improvement.",
        cta: "Monitor",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 9. Electronics
// ---------------------------------------------------------------------------

export function electronicsData(): ModuleDemoData {
  return {
    moduleId: "electronics",
    status: "operational",
    summary:
      "Deep diagnostics layer covering ECU health, sensor-fusion integrity, CAN-bus load, and all electronic-control-unit firmware status across the bike.",
    metrics: [
      {
        label: "ECU Temp",
        value: "68 °C",
        sub: "within spec (85 max)",
        accent: "positive",
        trend: "stable",
      },
      {
        label: "CAN Bus Load",
        value: "43 %",
        sub: "peak bus utilisation",
        accent: "positive",
        trend: "stable",
      },
      {
        label: "Sensor Health",
        value: "46 / 48",
        sub: "2 in degraded mode",
        accent: "warning",
        trend: "down",
      },
      {
        label: "Firmware Version",
        value: "2.7.4",
        sub: "current baseline",
        accent: "neutral",
        trend: "stable",
      },
    ],
    decision: {
      title: "Flash revised TC-slip firmware (2.7.5-rc)?",
      recommendation:
        "RC firmware 2.7.5 includes optimised slip-detection filter reducing TC-trigger latency by 12 ms. Bench-tested 500+ cycles. Recommend flash at next pit stop (downtime: 90 s).",
      impact: "–12 ms TC latency | 90 s pit downtime | no expected regression",
      confidence: 93,
      urgency: "medium",
      actionLabel: "Flash 2.7.5-rc",
    },
    evidence: [
      {
        label: "Current TC Latency",
        value: "34 ms",
        source: "ECU log (interrupt timing)",
        type: "sensor",
      },
      {
        label: "RC Latency Gain",
        value: "–12 ms (22 ms)",
        source: "Bench-test report #417",
        type: "model",
      },
      {
        label: "Regression Tests Passed",
        value: "512 / 512",
        source: "CI pipeline",
        type: "external",
      },
      {
        label: "Flash Duration",
        value: "90 s (nominal)",
        source: "Pit-crew time study",
        type: "historical",
      },
    ],
    risks: [
      { label: "Flash failure / ECU brick", value: "1.2%" },
      { label: "Rider discomfort with new TC feel", value: "15.0%" },
    ],
    confidence: 93,
    nextActions: [
      {
        label: "Flash 2.7.5-rc at next stop",
        description: "Schedule 90 s flash during next pit stop. Notify crew chief.",
        cta: "Schedule Flash",
      },
      {
        label: "Prepare rollback image",
        description: "Keep 2.7.4 image on hand for immediate revert if needed.",
        cta: "Prepare Rollback",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 10. Aerodynamics
// ---------------------------------------------------------------------------

export function aerodynamicsData(): ModuleDemoData {
  return {
    moduleId: "aerodynamics",
    status: "operational",
    summary:
      "Aero-balance monitoring computing real-time downforce, drag coefficient, and pitch sensitivity from pressure-sensor arrays and GPS-derived speed deltas.",
    metrics: [
      {
        label: "Downforce",
        value: "287 N",
        sub: "at 300 km/h",
        accent: "neutral",
        trend: "stable",
      },
      {
        label: "Drag Coefficient",
        value: "0.567 Cd",
        sub: "current body config",
        accent: "neutral",
        trend: "stable",
      },
      {
        label: "Aero Balance",
        value: "58 / 42",
        sub: "front / rear %",
        accent: "neutral",
        trend: "down",
      },
      {
        label: "Pitch Sensitivity",
        value: "0.12 °/G",
        sub: "yaw-plane stability",
        accent: "positive",
        trend: "stable",
      },
    ],
    decision: {
      title: "Add 2 mm front-wing gurney for more front downforce?",
      recommendation:
        "Rider reports understeer in high-speed T3/T11. A 2 mm gurney flap on the front wing adds 12 N front downforce at 280+ km/h, shifting aero balance forward 2 points.",
      impact: "–0.10 s/lap sector 1+3 | top-speed loss 0.4 km/h negligible",
      confidence: 84,
      urgency: "medium",
      actionLabel: "Fit 2 mm Gurney",
    },
    evidence: [
      {
        label: "Front Downforce Deficit",
        value: "–14 N vs. baseline",
        source: "Floor pressure array",
        type: "sensor",
      },
      {
        label: "High-Speed Understeer Index",
        value: "0.32 °/s (excess)",
        source: "Yaw-rate model",
        type: "model",
      },
      {
        label: "Gurney Delta (sim)",
        value: "+12 N front / –0.4 km/h",
        source: "CFD run #203",
        type: "model",
      },
      {
        label: "Rider comment",
        value: "T3 entry push wide",
        source: "Crew-chief radio log",
        type: "comms",
      },
    ],
    risks: [
      { label: "Top-speed loss on main straight", value: "0.4 km/h (acceptable)" },
      { label: "Rear grip reduction (balance shift)", value: "5.0%" },
    ],
    confidence: 84,
    nextActions: [
      {
        label: "Fit 2 mm gurney",
        description: "Install gurney flap. Validate with 3 aero-mapping laps.",
        cta: "Install",
      },
      {
        label: "Re-balance rear wing",
        description: "Consider 1-step rear-wing angle reduction if rear grip drops.",
        cta: "Plan",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 11. Fuel & Energy
// ---------------------------------------------------------------------------

export function fuelEnergyData(): ModuleDemoData {
  return {
    moduleId: "fuel-energy",
    status: "operational",
    summary:
      "Fuel-consumption modelling, lift-and-coast optimisation, and energy-recovery tracking to ensure the rider hits the chequered flag with minimum fuel margin.",
    metrics: [
      {
        label: "Fuel Used",
        value: "14.7 L",
        sub: "22 laps completed",
        accent: "neutral",
        trend: "up",
      },
      {
        label: "Consumption Rate",
        value: "4.82 L/lap",
        sub: "target: 4.75",
        accent: "warning",
        trend: "up",
      },
      {
        label: "Lift & Coast Saved",
        value: "0.6 L",
        sub: "this stint",
        accent: "positive",
        trend: "up",
      },
      {
        label: "Projected Margin",
        value: "0.4 L",
        sub: "at finish (target > 0.3)",
        accent: "warning",
        trend: "down",
      },
    ],
    decision: {
      title: "Activate fuel-map B (lean) for final 5 laps?",
      recommendation:
        "Consumption trending 1.5 % above target. Projected margin falls to 0.3 L — within safety buffer but tight. Engage fuel-map B (–3 % power, –4 % fuel flow) for final 5 laps.",
      impact: "–4 % fuel flow | +0.12 s/lap penalty | margin restored to 0.9 L",
      confidence: 92,
      urgency: "high",
      actionLabel: "Engage Map B",
    },
    evidence: [
      {
        label: "Current Fuel Remaining",
        value: "8.7 L",
        source: "ECU fuel-level sensor",
        type: "sensor",
      },
      {
        label: "Consumption Trend",
        value: "+1.5 % vs. model",
        source: "Fuel-consumption model v2.2",
        type: "model",
      },
      {
        label: "Map-B Penalty",
        value: "+0.12 s/lap",
        source: "Engine-dyno derived",
        type: "model",
      },
      {
        label: "Map-B Fuel Saving",
        value: "–4.5 % per lap",
        source: "ECU fuel-map table",
        type: "sensor",
      },
    ],
    risks: [
      { label: "Rider needs full power for battle", value: "18.0%" },
      { label: "Margin over-estimated (model drift)", value: "6.0%" },
    ],
    confidence: 92,
    nextActions: [
      {
        label: "Engage fuel-map B",
        description: "Switch to lean map for final 5 laps. Monitor lambda and EGT.",
        cta: "Engage",
      },
      {
        label: "Advise rider lift & coast",
        description: "Brief rider to add 10 m lift point at T1, T9, T13.",
        cta: "Brief",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 12. Chassis Geometry
// ---------------------------------------------------------------------------

export function chassisGeometryData(): ModuleDemoData {
  return {
    moduleId: "chassis-geometry",
    status: "operational",
    summary:
      "Suspension geometry, ride-height optimisation, and swing-arm position monitoring to maintain the chassis in its ideal mechanical operating window.",
    metrics: [
      {
        label: "Ride Height",
        value: "48 mm",
        sub: "front / 52 mm rear",
        accent: "neutral",
        trend: "stable",
      },
      {
        label: "Swing-Arm Angle",
        value: "4.2 °",
        sub: "within target range",
        accent: "positive",
        trend: "stable",
      },
      {
        label: "Front Preload",
        value: "22 clicks",
        sub: "out of 30",
        accent: "neutral",
        trend: "down",
      },
      {
        label: "Fork Compression",
        value: "18 clicks",
        sub: "low-speed circuit",
        accent: "neutral",
        trend: "stable",
      },
    ],
    decision: {
      title: "Lower rear ride height 2 mm for improved drive?",
      recommendation:
        "Rider reports rear squat on corner exit (T5, T14). Lowering rear ride height 2 mm increases anti-squat and improves drive traction. No geometry-penalty predicted.",
      impact: "–0.09 s/lap exit speed gained | ground-clearance OK",
      confidence: 86,
      urgency: "medium",
      actionLabel: "Lower Rear –2 mm",
    },
    evidence: [
      {
        label: "Rear Squat (T5 exit)",
        value: "18 mm (excess)",
        source: "Potentiometer sensor LH/RH",
        type: "sensor",
      },
      {
        label: "Rear Squat (T14 exit)",
        value: "16 mm (excess)",
        source: "Potentiometer sensor LH/RH",
        type: "sensor",
      },
      {
        label: "Anti-Squat Gain",
        value: "+8 % (simulated)",
        source: "Multibody simulation",
        type: "model",
      },
      {
        label: "Ground Clearance Margin",
        value: "11 mm (min 8 mm)",
        source: "Chassis CAD spec",
        type: "historical",
      },
    ],
    risks: [
      { label: "Ground clearance violation (bumping)", value: "4.0%" },
      { label: "Front-end feel change", value: "7.0%" },
    ],
    confidence: 86,
    nextActions: [
      {
        label: "Lower rear ride height",
        description: "Adjust rear ride height –2 mm. Re-check with laser alignment.",
        cta: "Adjust",
      },
      {
        label: "Validate with 3 laps",
        description: "Rider to push exit of T5/T14 and report rear stability.",
        cta: "Validate",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 13. Brake Thermal
// ---------------------------------------------------------------------------

export function brakeThermalData(): ModuleDemoData {
  return {
    moduleId: "brake-thermal",
    status: "operational",
    summary:
      "Brake-disc temperature monitoring, wear prediction, and cooling-flow optimisation to prevent fade and ensure consistent stopping performance.",
    metrics: [
      {
        label: "Front Disc Temp",
        value: "672 °C",
        sub: "peak at T1 braking",
        accent: "warning",
        trend: "up",
      },
      {
        label: "Rear Disc Temp",
        value: "312 °C",
        sub: "steady-state",
        accent: "neutral",
        trend: "stable",
      },
      {
        label: "Brake Wear",
        value: "67 %",
        sub: "remaining life",
        accent: "neutral",
        trend: "down",
      },
      {
        label: "Cooling Duct Flow",
        value: "84 %",
        sub: "of max capacity",
        accent: "positive",
        trend: "stable",
      },
    ],
    decision: {
      title: "Open front brake-duct flaps for T1 cooling?",
      recommendation:
        "Front disc hitting 672 °C peak at T1 (threshold 680 °C). Open cooling-duct flaps to 100 % for 3 laps. Expected peak drop of ~45 °C with negligible drag penalty.",
      impact: "–45 °C peak disc temp | drag +0.6 % (acceptable)",
      confidence: 95,
      urgency: "critical",
      actionLabel: "Open Ducts 100 %",
    },
    evidence: [
      {
        label: "Peak Temp (T1)",
        value: "672 °C",
        source: "Brake-disc pyrometer",
        type: "sensor",
      },
      {
        label: "Threshold Temp",
        value: "680 °C (fade onset)",
        source: "Brembo tech sheet",
        type: "historical",
      },
      {
        label: "Duct Flow Delta",
        value: "+22 % mass flow",
        source: "CFD duct model",
        type: "model",
      },
      {
        label: "Drag Penalty",
        value: "+0.6 % (0.03 s/lap)",
        source: "Aero balance model",
        type: "model",
      },
    ],
    risks: [
      { label: "Disc cracking from thermal shock", value: "3.5%" },
      { label: "Drag penalty affects top-speed battle", value: "6.0%" },
    ],
    confidence: 95,
    nextActions: [
      {
        label: "Open brake ducts",
        description: "Command duct flaps to 100 %. Monitor front disc temp drop.",
        cta: "Open Ducts",
      },
      {
        label: "Prepare cooler-compound pads",
        description: "Have medium-compound pads ready if temps persist above 650 °C.",
        cta: "Prep Pads",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 14. Rival Radar
// ---------------------------------------------------------------------------

export function rivalRadarData(): ModuleDemoData {
  return {
    moduleId: "rival-radar",
    status: "operational",
    summary:
      "Competitor analysis engine tracking rival lap times, sector deltas, pit strategies, and historical weakness patterns to inform race tactics.",
    metrics: [
      {
        label: "Rivals Tracked",
        value: "8",
        sub: "top-10 + 2 threats",
        accent: "neutral",
        trend: "stable",
      },
      {
        label: "Avg Rival Delta",
        value: "+0.142 s",
        sub: "our rider leads",
        accent: "positive",
        trend: "up",
      },
      {
        label: "Rival Pit Windows",
        value: "3 open",
        sub: "laps 10–14",
        accent: "warning",
        trend: "up",
      },
      {
        label: "Sector Vulnerability",
        value: "S3 (our weak)",
        sub: "–0.087 s deficit",
        accent: "critical",
        trend: "down",
      },
    ],
    decision: {
      title: "Defend inside line T1 against rival #93?",
      recommendation:
        "Rival #93 (Marc) is 0.12 s faster in S1, typically passes T1 inside. Recommend defending inside line at T1 entry for first 3 laps after restart. Block-pass probability drops from 68 % to 22 %.",
      impact: "Block-pass probability reduced to 22 % | tyre scrub +0.3 °C negligible",
      confidence: 82,
      urgency: "high",
      actionLabel: "Defend T1 Inside",
    },
    evidence: [
      {
        label: "#93 S1 Advantage",
        value: "+0.120 s",
        source: "Sector delta analysis",
        type: "model",
      },
      {
        label: "#93 Preferred Pass",
        value: "T1 inside (68 %)",
        source: "Historical pass DB",
        type: "historical",
      },
      {
        label: "Our S1 Braking Score",
        value: "7.2 / 10",
        source: "Braking-performance index",
        type: "model",
      },
      {
        label: "Restart Lap Tyre Temp",
        value: "88 °C front (sub-optimal)",
        source: "Tyre thermocouple",
        type: "sensor",
      },
    ],
    risks: [
      { label: "Wide exit compromises T2–T3", value: "14.0%" },
      { label: "#93 switches to T3 pass instead", value: "10.0%" },
    ],
    confidence: 82,
    nextActions: [
      {
        label: "Brief rider: defend T1 inside",
        description: "Protect inside curb at restart. Accept wider T1 exit if needed.",
        cta: "Brief Rider",
      },
      {
        label: "Monitor #93 S1 sector",
        description: "Watch #93 S1 mini-sector telemetry for intent prediction.",
        cta: "Monitor",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 15. Qualifying Lab
// ---------------------------------------------------------------------------

export function qualifyingLabData(): ModuleDemoData {
  return {
    moduleId: "qualifying-lab",
    status: "operational",
    summary:
      "Qualifying simulation suite optimising run plans, tyre-window timing, tow strategy, and sector-by-sector push mapping for Q1/Q2 pole attacks.",
    metrics: [
      {
        label: "Sim Lap Time",
        value: "1:38.427",
        sub: "optimal theoretical",
        accent: "positive",
        trend: "up",
      },
      {
        label: "Tyre Window",
        value: "92 %",
        sub: "grip peak predicted",
        accent: "positive",
        trend: "stable",
      },
      {
        label: "Run Plan",
        value: "Out – Push – In – Push",
        sub: "2 hot laps + cool",
        accent: "neutral",
        trend: "stable",
      },
      {
        label: "Tow Opportunity",
        value: "Lap 3 (rival #23)",
        sub: "estimated +0.08 s",
        accent: "positive",
        trend: "up",
      },
    ],
    decision: {
      title: "Deploy two-hot-lap run plan (Q2)?",
      recommendation:
        "Tyre grip window peaks at lap 2–3 with 92 % confidence. Two hot laps back-to-back (push, cool-tow, push) extract optimal tyre performance. Tow from #23 available on lap 3.",
      impact: "Projected lap 1: 1:38.65 | lap 2: 1:38.42 (pole contention)",
      confidence: 85,
      urgency: "high",
      actionLabel: "Deploy 2-Hot Plan",
    },
    evidence: [
      {
        label: "Tyre Grip Curve Peak",
        value: "Lap 2–3 (92 %)",
        source: "Tyre-warmup model v4.6",
        type: "model",
      },
      {
        label: "Sim Optimal",
        value: "1:38.427",
        source: "Qualifying lap sim",
        type: "model",
      },
      {
        label: "Rival #23 Out-Lap Timing",
        value: "+3.2 s gap (target)",
        source: "GPS position prediction",
        type: "model",
      },
      {
        label: "Fuel Load",
        value: "3.8 L (min required)",
        source: "Fuel-consumption model",
        type: "model",
      },
    ],
    risks: [
      { label: "Yellow flag during hot lap", value: "8.0%" },
      { label: "Tyre drop-off on second push lap", value: "12.0%" },
    ],
    confidence: 85,
    nextActions: [
      {
        label: "Brief rider: 2-hot-lap plan",
        description: "Out, push, cool-tow lap behind #23, final push. Commit now.",
        cta: "Brief",
      },
      {
        label: "Align pit-crew for quick turn",
        description: "Warmers on, fuel top-up, rear-tyre blanket check between runs.",
        cta: "Crew Prep",
      },
    ],
  };
}
