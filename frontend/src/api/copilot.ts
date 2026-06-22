import { post, get } from "./client";
import type { CircuitSpecificPart } from "../types/part";

export type CopilotResponse = {
  question: string;
  answer: string;
  evidence: { source: string; type: string; confidence: number }[];
  tool_calls: { tool: string; status: string; approval_required: boolean }[];
  requires_approval: boolean;
  approval_status: string;
  confidence: number;
  mode: string;
};

export type BlueprintPartContext = Pick<
  CircuitSpecificPart,
  | "part_id"
  | "name"
  | "part_type"
  | "target_circuit_id"
  | "problem_statement"
  | "technical_hypothesis"
  | "expected_impact"
  | "material"
  | "estimated_weight_g"
  | "manufacturing_method"
  | "risk_level"
  | "status"
>;

export type BlueprintDesignRequest = {
  question: string;
  context: {
    source: "parts_design_page";
    intent: "blueprint_design_brief";
    part_context: BlueprintPartContext;
  };
};

const BLUEPRINT_PROMPT =
  "Generate a concise Blueprint.am design brief for the selected race part. Focus on geometry, material/manufacturing direction, simulation intent, and the next evidence-backed step. Do not cover setup management or platform overview.";

export const buildBlueprintDesignRequest = (
  partContext: BlueprintPartContext,
): BlueprintDesignRequest => ({
  question: `${BLUEPRINT_PROMPT}\n\nPart context:\n${partContext.name} (${partContext.part_id})`,
  context: {
    source: "parts_design_page",
    intent: "blueprint_design_brief",
    part_context: partContext,
  },
});

export const askBlueprintDesignBrief = (partContext: BlueprintPartContext) => {
  const request = buildBlueprintDesignRequest(partContext);
  return askCopilot(request.question, request.context);
};

export const askCopilot = (question: string, context?: object) =>
  post<CopilotResponse>("/copilot/ask", { question, ...context });

export const getCopilotStatus = () => get("/copilot/status");
