import { COPILOT_CONTEXT, COPILOT_MODE, type CopilotMode } from "../data/copilot-data";
import { DEMO_RACE_SESSION } from "../data/session-launch-data";
import { DATA_SOURCES, SESSION_MODES, type RaceSessionContext } from "../types/race-session";

export interface AICopilotMessageContext {
  dataSource: string;
  telemetryStatus: string;
  activeModules: string[];
  circuitConfidence: number;
  decisionStage?: string;
  telemetryEvent?: string;
  priorityItem?: string;
}

export interface BuildCopilotPayloadOptions {
  session?: RaceSessionContext;
  sessionId?: string;
  nodeId?: string;
  decisionStage?: string;
  telemetryEvent?: string;
  priorityItem?: string;
}

export interface AICopilotMessagePayload {
  message: string;
  nodeId: string;
  sessionId: string;
  riderId: string;
  bikeId: string;
  circuit: string;
  mode: CopilotMode;
  context: AICopilotMessageContext;
}

export interface AICopilotEvidenceItem {
  label: string;
  value: string;
  source: string;
}

export interface AICopilotSuggestedMission {
  title: string;
  objective: string;
  validationMetric: string;
}

export interface AICopilotMessageResponse {
  answer: string;
  confidence: number;
  evidence: AICopilotEvidenceItem[];
  suggestedMission: AICopilotSuggestedMission;
}

export interface AICopilotClientResult {
  response: AICopilotMessageResponse;
  preview: boolean;
  previewReason: string;
}

const ENDPOINT_PATH = "/api/copilot/message";
const DEFAULT_NODE_ID = "rcc-node-pitwall-15";

function readBaseUrl(): string | null {
  const configuredUrl = import.meta.env.VITE_RACE_AI_COPILOT_URL;
  if (typeof configuredUrl !== "string") return null;
  const trimmed = configuredUrl.trim();
  return trimmed.length > 0 ? trimmed.replace(/\/$/, "") : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function readNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function parseEvidence(value: unknown): AICopilotEvidenceItem[] | null {
  if (!Array.isArray(value)) return null;

  const evidence = value.map((item) => {
    if (!isRecord(item)) return null;
    const label = readString(item.label);
    const itemValue = readString(item.value);
    const source = readString(item.source);
    if (!label || !itemValue || !source) return null;
    return { label, value: itemValue, source };
  });

  if (evidence.some((item) => item === null)) return null;
  return evidence.filter((item): item is AICopilotEvidenceItem => item !== null);
}

function parseSuggestedMission(value: unknown): AICopilotSuggestedMission | null {
  if (!isRecord(value)) return null;
  const title = readString(value.title);
  const objective = readString(value.objective);
  const validationMetric = readString(value.validationMetric);
  if (!title || !objective || !validationMetric) return null;
  return { title, objective, validationMetric };
}

function normalizeCopilotResponse(value: unknown): AICopilotMessageResponse | null {
  if (!isRecord(value)) return null;
  const answer = readString(value.answer);
  const confidence = readNumber(value.confidence);
  const evidence = parseEvidence(value.evidence);
  const suggestedMission = parseSuggestedMission(value.suggestedMission);

  if (!answer || confidence === null || !evidence || !suggestedMission) return null;

  return {
    answer,
    confidence,
    evidence,
    suggestedMission,
  };
}

export function normalizeSessionModeForCopilot(session: RaceSessionContext): CopilotMode {
  if (session.mode === SESSION_MODES.REPLAY) return COPILOT_MODE.REPLAY;
  if (session.mode === SESSION_MODES.SIMULATION) return COPILOT_MODE.PREVIEW;

  // Service 16 currently accepts only preview | live | replay. Practice,
  // qualifying and race are treated as live only when the selected data source
  // is live telemetry; upload/demo/simulation remain preview-safe.
  return session.dataSource === DATA_SOURCES.LIVE ? COPILOT_MODE.LIVE : COPILOT_MODE.PREVIEW;
}

function fallbackText(value: string | undefined, fallback: string): string | undefined {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

export function buildCopilotPayload(
  message: string,
  options: BuildCopilotPayloadOptions = {},
): AICopilotMessagePayload {
  const session = options.session ?? DEMO_RACE_SESSION;

  return {
    message,
    nodeId: options.nodeId ?? DEFAULT_NODE_ID,
    sessionId: options.sessionId ?? COPILOT_CONTEXT.sessionId,
    riderId: session.riderId,
    bikeId: session.bikeId,
    circuit: session.circuitName,
    mode: normalizeSessionModeForCopilot(session),
    context: {
      dataSource: session.dataSource,
      telemetryStatus: session.telemetryStatus,
      activeModules: session.activeModules,
      circuitConfidence: session.circuitConfidence,
      telemetryEvent: fallbackText(options.telemetryEvent, COPILOT_CONTEXT.telemetryEvent),
      priorityItem: fallbackText(options.priorityItem, COPILOT_CONTEXT.priorityItem),
      decisionStage: fallbackText(options.decisionStage, COPILOT_CONTEXT.decisionStage),
    },
  };
}

export function createFallbackResponse(
  message: string,
  payload: AICopilotMessagePayload = buildCopilotPayload(message),
): AICopilotMessageResponse {
  const telemetryEvent = payload.context.telemetryEvent ?? "Session telemetry context pending";
  const priorityItem = payload.context.priorityItem ?? "Session priority context pending";
  const decisionStage = payload.context.decisionStage ?? "Recommendation";

  return {
    answer: `Preview response for: “${message}”\n\nThe AI Copilot is operating locally because service 16 is not connected. Treat this as a contract preview: telemetry is mapped into an event, cause, recommendation, mission, and validation target without calling the live model.`,
    confidence: 0.72,
    evidence: [
      {
        label: "Telemetry event",
        value: telemetryEvent,
        source: "local preview context",
      },
      {
        label: "Priority item",
        value: priorityItem,
        source: "local preview context",
      },
      {
        label: "Decision stage",
        value: decisionStage,
        source: "local preview context",
      },
    ],
    suggestedMission: {
      title: "Map B traction validation",
      objective: "Run a controlled 3-lap stint to confirm whether TC map B reduces rear slip at T7 exit without hurting launch stability.",
      validationMetric: "Rear slip delta below +3.0% for two consecutive laps with no increase in TC intervention count.",
    },
  };
}

export async function sendCopilotMessage(
  payload: AICopilotMessagePayload,
): Promise<AICopilotClientResult> {
  const baseUrl = readBaseUrl();

  if (!baseUrl) {
    return {
      response: createFallbackResponse(payload.message, payload),
      preview: true,
      previewReason: "VITE_RACE_AI_COPILOT_URL is not configured.",
    };
  }

  try {
    const res = await fetch(`${baseUrl}${ENDPOINT_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Service 16 returned HTTP ${res.status}`);
    }

    const parsed = normalizeCopilotResponse(await res.json());
    if (!parsed) {
      throw new Error("Service 16 response does not match the typed Copilot contract.");
    }

    return {
      response: parsed,
      preview: false,
      previewReason: "Connected to 16-race-ai-copilot.",
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown request failure";
    return {
      response: createFallbackResponse(payload.message, payload),
      preview: true,
      previewReason: `${message}. Showing local fallback preview.`,
    };
  }
}
