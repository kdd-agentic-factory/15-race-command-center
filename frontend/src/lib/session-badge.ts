import type { RaceSessionContext } from "../types/race-session";

/**
 * Returns the session badge label based on session context and persistence state.
 *
 * @param session - Current race session context
 * @param hasPersisted - Whether a session has been persisted (user launched a session)
 * @returns Badge label string
 */
export function sessionBadgeLabel(
  session: RaceSessionContext,
  hasPersisted: boolean,
): string {
  if (!hasPersisted || session.dataSource === "demo") return "Demo Session";
  if (session.mode === "simulation") return "Simulation Session";
  if (session.dataSource === "live") return "Live Session";
  return "Preview Session";
}

/**
 * Returns degradation messages based on session state.
 *
 * @param telemetryStatus - Current telemetry status
 * @param circuitConfidence - Circuit confidence percentage
 * @param dataSource - Current data source
 * @returns Array of degradation messages (empty if no degradation)
 */
export function getDegradationMessages(
  telemetryStatus: RaceSessionContext["telemetryStatus"],
  circuitConfidence: number,
  dataSource: RaceSessionContext["dataSource"],
): string[] {
  const messages: string[] = [];

  if (telemetryStatus === "missing") {
    messages.push("Telemetry data not available. Displaying simulated values.");
  } else if (telemetryStatus === "partial") {
    messages.push("Partial telemetry. Some channels may be missing.");
  }

  if (circuitConfidence < 80) {
    messages.push(
      "Circuit confidence below threshold. Intelligence may be incomplete.",
    );
  }

  if (dataSource === "simulation") {
    messages.push(
      "Simulation mode. Values are predicted, not measured.",
    );
  }

  return messages;
}

/**
 * CSS classes for the session badge.
 */
export const SESSION_BADGE_CLASSES =
  "rounded-kdd-pill border border-kdd-cyan/40 bg-kdd-cyan-dim px-3 py-1 font-kdd-mono text-[10px] text-kdd-cyan";
