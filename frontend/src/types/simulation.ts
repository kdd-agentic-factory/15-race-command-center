export type SimulationResult = {
  simulation_id: string;
  status: string;
  baseline_setup_id: string;
  change_summary: string;
  risk_level: string;
  estimated_lap_delta_ms?: number;
  corner_impacts: Record<string, unknown>[];
  thermal_risk?: string;
  spin_risk?: string;
  stability_risk?: string;
  notes?: string;
  mode: string;
};
