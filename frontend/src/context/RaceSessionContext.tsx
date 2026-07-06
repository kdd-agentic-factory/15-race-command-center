import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  CIRCUIT_OPTIONS,
  DEMO_RACE_SESSION,
  GARAGE_OPTIONS,
  MODE_OPTIONS,
} from "../data/session-launch-data";
import {
  DATA_SOURCES,
  SESSION_MODES,
  TELEMETRY_STATUSES,
  type DataSource,
  type RaceSessionContext as RaceSessionContextModel,
  type SessionMode,
  type TelemetryStatus,
} from "../types/race-session";

const STORAGE_KEY = "kdd.race-session-context.v1";

interface RaceSessionProviderValue {
  session: RaceSessionContextModel;
  hasPersistedSession: boolean;
  setSession: (session: RaceSessionContextModel) => void;
  resetSession: () => void;
}

interface RaceSessionProviderProps {
  children: ReactNode;
}

const RaceSessionContext = createContext<RaceSessionProviderValue | undefined>(undefined);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isSessionMode(value: unknown): value is SessionMode {
  return Object.values(SESSION_MODES).includes(value as SessionMode);
}

function isDataSource(value: unknown): value is DataSource {
  return Object.values(DATA_SOURCES).includes(value as DataSource);
}

function isTelemetryStatus(value: unknown): value is TelemetryStatus {
  return Object.values(TELEMETRY_STATUSES).includes(value as TelemetryStatus);
}

function isRaceSessionContext(value: unknown): value is RaceSessionContextModel {
  if (!isRecord(value)) return false;

  return (
    typeof value.circuitId === "string" &&
    typeof value.circuitName === "string" &&
    typeof value.circuitConfidence === "number" &&
    typeof value.riderId === "string" &&
    typeof value.riderName === "string" &&
    typeof value.bikeId === "string" &&
    typeof value.bikeName === "string" &&
    isSessionMode(value.mode) &&
    isDataSource(value.dataSource) &&
    isTelemetryStatus(value.telemetryStatus) &&
    isStringArray(value.activeModules)
  );
}

/**
 * Parse handoff query params from 13 (UI Command Center).
 *
 * Flow: 13 opens a new tab with `?handoff=preview&source=13-gateway&...`
 * → 15 reads params → creates session if no existing localStorage session.
 *
 * Returns null if:
 * - No `handoff=preview` param present
 * - SSR (no window)
 *
 * Handoff params are MERGED with demo defaults, not replacing them entirely.
 * `source` and `node` are metadata only — not persisted on the session.
 */
function parseHandoffParams(): Partial<RaceSessionContextModel> | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const handoff = params.get("handoff");
  if (handoff !== "preview") return null;

  const circuitId = params.get("circuit");
  const bikeParam = params.get("bike");
  const modeParam = params.get("mode");

  // Resolve circuit: look up in CIRCUIT_OPTIONS by ID, fall back to demo
  const circuit = circuitId
    ? CIRCUIT_OPTIONS.find((c) => c.id === circuitId)
    : null;

  // Resolve bike: look up in GARAGE_OPTIONS by bike ID prefix, fall back to demo
  const garage = bikeParam
    ? GARAGE_OPTIONS.find(
        (g) =>
          g.bikeId === bikeParam ||
          g.bikeName.toLowerCase().includes(bikeParam.toLowerCase()),
      )
    : null;

  // Resolve mode: validate against SESSION_MODES, fall back to demo
  const mode =
    modeParam && isSessionMode(modeParam)
      ? (modeParam as SessionMode)
      : DEMO_RACE_SESSION.mode;

  // Resolve active modules from mode
  const modeOption = MODE_OPTIONS.find((m) => m.id === mode);

  return {
    circuitId: circuit?.id ?? DEMO_RACE_SESSION.circuitId,
    circuitName: circuit?.name ?? DEMO_RACE_SESSION.circuitName,
    circuitConfidence: circuit?.confidence ?? DEMO_RACE_SESSION.circuitConfidence,
    riderId: garage?.id ?? DEMO_RACE_SESSION.riderId,
    riderName: garage?.riderName ?? DEMO_RACE_SESSION.riderName,
    bikeId: garage?.bikeId ?? DEMO_RACE_SESSION.bikeId,
    bikeName: garage?.bikeName ?? DEMO_RACE_SESSION.bikeName,
    mode,
    dataSource: DATA_SOURCES.DEMO,
    telemetryStatus: TELEMETRY_STATUSES.PARTIAL,
    activeModules: modeOption?.activeModules ?? DEMO_RACE_SESSION.activeModules,
  };
}

function readPersistedSession(): { session: RaceSessionContextModel; hasPersistedSession: boolean } {
  if (typeof window === "undefined") {
    return { session: DEMO_RACE_SESSION, hasPersistedSession: false };
  }

  const rawSession = window.localStorage.getItem(STORAGE_KEY);
  if (rawSession) {
    try {
      const parsedSession: unknown = JSON.parse(rawSession);
      if (isRaceSessionContext(parsedSession)) {
        return { session: parsedSession, hasPersistedSession: true };
      }
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  // No valid localStorage session — check handoff params from 13
  const handoffSession = parseHandoffParams();
  if (handoffSession) {
    // Merge handoff params with demo defaults to produce a complete session
    const session: RaceSessionContextModel = {
      ...DEMO_RACE_SESSION,
      ...handoffSession,
    };
    return { session, hasPersistedSession: false };
  }

  return { session: DEMO_RACE_SESSION, hasPersistedSession: false };
}

export function RaceSessionProvider({ children }: RaceSessionProviderProps) {
  const [state, setState] = useState(readPersistedSession);

  useEffect(() => {
    if (!state.hasPersistedSession) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.session));
  }, [state]);

  function setSession(session: RaceSessionContextModel) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
    setState({ session, hasPersistedSession: true });
  }

  function resetSession() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setState({ session: DEMO_RACE_SESSION, hasPersistedSession: false });
  }

  return (
    <RaceSessionContext.Provider
      value={{
        session: state.session,
        hasPersistedSession: state.hasPersistedSession,
        setSession,
        resetSession,
      }}
    >
      {children}
    </RaceSessionContext.Provider>
  );
}

export function useRaceSession() {
  const context = useContext(RaceSessionContext);
  if (!context) {
    throw new Error("useRaceSession must be used within RaceSessionProvider");
  }
  return context;
}

export { STORAGE_KEY as RACE_SESSION_STORAGE_KEY };
