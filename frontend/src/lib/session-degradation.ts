/**
 * Centralized degradation messages for Race Command Center.
 *
 * All pages should use these constants instead of inline strings
 * to ensure consistent messaging across the operational surface.
 */

export const DEGRADATION_MESSAGES = {
  telemetryMissing:
    "Telemetry data not available. Displaying simulated values.",
  telemetryPartial:
    "Partial telemetry. Some channels may be missing.",
  simulationMode:
    "Simulation mode. Values are predicted, not measured.",
  lowConfidence:
    "Circuit confidence below threshold.",
  demoSetupPreview:
    "Demo setup preview. Telemetry data not available — displaying baseline/demo configuration for reference.",
  partialTelemetrySetup:
    "Partial telemetry. Setup recommendations have reduced confidence — validate against rider feedback.",
  predictedSetup:
    "Predicted setup. Values derived from simulation model, not live telemetry.",
  demoRecommendations:
    "Demo recommendations. Telemetry data not available — recommendations are illustrative, not operational.",
  predictedRecommendations:
    "Predicted recommendations. Derived from simulation model — validate before pit-wall execution.",
  demoStrategy:
    "Demo strategy. Telemetry data not available — strategy is illustrative.",
  predictedStrategy:
    "Predicted strategy. Derived from simulation model — outcomes are probabilistic, not measured.",
  simulationModeReports:
    "Simulation mode — reports will contain predicted data, not measured values.",
  simulationModeTwin:
    "Simulation mode active — all values are predicted, not measured.",
  lowCircuitConfidence:
    "Circuit confidence below threshold — model predictions may be less accurate.",
} as const;

/**
 * Returns degradation warnings based on session state parameters.
 *
 * Use this instead of inline conditional messages in pages.
 */
export function getDegradationWarnings(params: {
  telemetryStatus?: string;
  dataSource?: string;
  circuitConfidence?: number;
}): string[] {
  const messages: string[] = [];

  if (params.telemetryStatus === "missing") {
    messages.push(DEGRADATION_MESSAGES.telemetryMissing);
  } else if (params.telemetryStatus === "partial") {
    messages.push(DEGRADATION_MESSAGES.telemetryPartial);
  }

  if (
    typeof params.circuitConfidence === "number" &&
    params.circuitConfidence < 80
  ) {
    messages.push(DEGRADATION_MESSAGES.lowConfidence);
  }

  if (params.dataSource === "simulation") {
    messages.push(DEGRADATION_MESSAGES.simulationMode);
  }

  return messages;
}
