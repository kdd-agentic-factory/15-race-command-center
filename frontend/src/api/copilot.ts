import { post, get } from "./client";

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

export const askCopilot = (question: string, context?: object) =>
  post<CopilotResponse>("/copilot/ask", { question, ...context });

export const getCopilotStatus = () => get("/copilot/status");
