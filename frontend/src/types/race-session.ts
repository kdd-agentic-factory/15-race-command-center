export const SESSION_MODES = {
  PRACTICE: "practice",
  QUALIFYING: "qualifying",
  RACE: "race",
  REPLAY: "replay",
  SIMULATION: "simulation",
} as const;

export const DATA_SOURCES = {
  LIVE: "live",
  UPLOAD: "upload",
  DEMO: "demo",
  SIMULATION: "simulation",
} as const;

export const TELEMETRY_STATUSES = {
  READY: "ready",
  PARTIAL: "partial",
  MISSING: "missing",
} as const;

export const CIRCUIT_READINESS = {
  READY: "READY",
  PARTIAL: "PARTIAL",
  SIMULATED: "SIMULATED",
} as const;

export type SessionMode = (typeof SESSION_MODES)[keyof typeof SESSION_MODES];
export type DataSource = (typeof DATA_SOURCES)[keyof typeof DATA_SOURCES];
export type TelemetryStatus = (typeof TELEMETRY_STATUSES)[keyof typeof TELEMETRY_STATUSES];
export type CircuitReadiness = (typeof CIRCUIT_READINESS)[keyof typeof CIRCUIT_READINESS];

export interface RaceSessionContext {
  circuitId: string;
  circuitName: string;
  circuitConfidence: number;
  riderId: string;
  riderName: string;
  bikeId: string;
  bikeName: string;
  mode: SessionMode;
  dataSource: DataSource;
  telemetryStatus: TelemetryStatus;
  activeModules: string[];
}

export interface CircuitOption {
  id: string;
  name: string;
  country: string;
  readiness: CircuitReadiness;
  confidence: number;
  sectors: string;
  corners: string;
  elevation: string;
  telemetryReadiness: string;
  intelligenceSummary: string;
}

export interface GarageOption {
  id: string;
  riderName: string;
  bikeId: string;
  bikeName: string;
  setupBaseline: string;
  tyreProfile: string;
  riskProfile: string;
  garageReadiness: string;
}

export interface ModeOption {
  id: SessionMode;
  label: string;
  reasoning: string;
  activeModules: string[];
}

export interface DataSourceOption {
  id: DataSource;
  label: string;
  telemetryStatus: TelemetryStatus;
  channelStatus: string;
  degradationCopy: string;
}
