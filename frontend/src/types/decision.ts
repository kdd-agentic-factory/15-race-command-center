export type DecisionStatus =
  | "draft"
  | "proposed"
  | "simulation_required"
  | "simulation_completed"
  | "crew_chief_review"
  | "approved"
  | "rejected"
  | "applied"
  | "archived";

export type CrewChiefDecision = {
  decision_id: string;
  session_id?: string;
  recommendation_id?: string;
  title: string;
  decision_type: string;
  risk_level: string;
  status: DecisionStatus;
  proposed_by: string;
  approved_by?: string;
  evidence: Record<string, unknown>[];
  simulation_id?: string;
  workflow_id?: string;
  created_at?: string;
  decided_at?: string;
  notes?: string;
};
