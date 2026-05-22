export type PartStatus =
  | "concept"
  | "designed"
  | "simulated"
  | "approved_for_manufacturing"
  | "manufactured"
  | "mounted"
  | "tested"
  | "rejected"
  | "archived";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type CircuitSpecificPart = {
  part_id: string;
  name: string;
  part_type: string;
  target_circuit_id: string;
  problem_statement: string;
  technical_hypothesis: string;
  expected_impact: string;
  material?: string;
  estimated_weight_g?: number;
  manufacturing_method?: string;
  risk_level: RiskLevel;
  status: PartStatus;
  simulation_id?: string;
  evidence: Record<string, unknown>[];
  approval_status: string;
  metadata: Record<string, unknown>;
};
