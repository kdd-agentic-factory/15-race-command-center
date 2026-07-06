export const COPILOT_MODE = {
  PREVIEW: "preview",
  LIVE: "live",
  REPLAY: "replay",
} as const;

export type CopilotMode = (typeof COPILOT_MODE)[keyof typeof COPILOT_MODE];

export const DECISION_STAGE = {
  TELEMETRY: "Telemetry",
  EVENT: "Event",
  CAUSE: "Cause",
  RECOMMENDATION: "Recommendation",
  MISSION: "Mission",
  VALIDATION: "Validation",
} as const;

export type DecisionStage = (typeof DECISION_STAGE)[keyof typeof DECISION_STAGE];

export const PROMPT_GROUP_ID = {
  DECISION_LOOP: "decision-loop",
  MISSION_BUILDER: "mission-builder",
  EVIDENCE_REVIEW: "evidence-review",
  COACH_SUMMARY: "coach-summary",
} as const;

export type PromptGroupId = (typeof PROMPT_GROUP_ID)[keyof typeof PROMPT_GROUP_ID];

export interface CopilotContextSnapshot {
  nodeId: string;
  sessionId: string;
  riderId: string;
  bikeId: string;
  circuit: string;
  mode: CopilotMode;
  telemetryEvent: string;
  priorityItem: string;
  decisionStage: DecisionStage;
}

export interface DecisionLoopItem {
  stage: DecisionStage;
  title: string;
  detail: string;
  status: string;
}

export interface EvidenceCard {
  label: string;
  value: string;
  source: string;
}

export interface PromptGroup {
  id: PromptGroupId;
  label: string;
  description: string;
  prompts: string[];
}

export interface PrimaryAction {
  label: string;
  prompt: string;
}

export const COPILOT_CONTEXT: CopilotContextSnapshot = {
  nodeId: "rcc-node-pitwall-15",
  sessionId: "FP2-VAL-2026-07-03",
  riderId: "RIDER-93",
  bikeId: "BIKE-RC16-02",
  circuit: "MotorLand Aragón",
  mode: COPILOT_MODE.PREVIEW,
  telemetryEvent: "Rear grip delta +8.4% at T7 exit across last 3 laps",
  priorityItem: "Validate traction-control map B before qualifying simulation",
  decisionStage: DECISION_STAGE.RECOMMENDATION,
};

export const DECISION_LOOP: DecisionLoopItem[] = [
  {
    stage: DECISION_STAGE.TELEMETRY,
    title: "Rear tire slip spike",
    detail: "Sector 2 exit slip ratio is above race baseline with stable throttle trace.",
    status: "live feed",
  },
  {
    stage: DECISION_STAGE.EVENT,
    title: "Exit traction loss",
    detail: "The loss repeats on laps 8-10 after tire temperature crosses the warm band.",
    status: "detected",
  },
  {
    stage: DECISION_STAGE.CAUSE,
    title: "Thermal saturation",
    detail: "Rear carcass temp and TC intervention correlate with corner-exit drift.",
    status: "hypothesis",
  },
  {
    stage: DECISION_STAGE.RECOMMENDATION,
    title: "Map B validation",
    detail: "Run a short mission with constrained launch and exit-throttle targets.",
    status: "proposed",
  },
  {
    stage: DECISION_STAGE.MISSION,
    title: "3-lap validation",
    detail: "Hold consistent entry speed and compare slip delta against current map.",
    status: "ready",
  },
  {
    stage: DECISION_STAGE.VALIDATION,
    title: "Coach sign-off",
    detail: "Confirm confidence, risk, and rider instruction before qualifying sim.",
    status: "pending",
  },
];

export const EVIDENCE_CARDS: EvidenceCard[] = [
  {
    label: "Telemetry anomaly",
    value: "+8.4% rear slip at T7 exit",
    source: "15-race-command-center/live-telemetry",
  },
  {
    label: "PitWall priority",
    value: "TC map validation ranked #1",
    source: "Adaptive Pit-Wall Cockpit",
  },
  {
    label: "Circuit context",
    value: "Long right exits stress rear thermal window",
    source: "Circuit Intelligence",
  },
  {
    label: "Validation target",
    value: "Reduce slip delta below +3.0% over 3 laps",
    source: "Mission Builder",
  },
];

export const PROMPT_GROUPS: PromptGroup[] = [
  {
    id: PROMPT_GROUP_ID.DECISION_LOOP,
    label: "Decision loop",
    description: "Explain how telemetry became an operational recommendation.",
    prompts: [
      "Explain the current PitWall decision from telemetry to recommendation.",
      "What cause is most likely behind the rear grip delta?",
      "Which decision-loop stage needs more evidence before rider instruction?",
    ],
  },
  {
    id: PROMPT_GROUP_ID.MISSION_BUILDER,
    label: "Mission builder",
    description: "Turn the recommendation into a measurable validation run.",
    prompts: [
      "Generate a validation mission for traction-control map B.",
      "Define rider instructions and success criteria for the next 3 laps.",
      "What should race engineering monitor during the mission?",
    ],
  },
  {
    id: PROMPT_GROUP_ID.EVIDENCE_REVIEW,
    label: "Evidence review",
    description: "Audit the evidence before the crew commits to an action.",
    prompts: [
      "Review the evidence and identify the weakest assumption.",
      "What data would increase confidence before the next run?",
      "List the sources that support this recommendation.",
    ],
  },
  {
    id: PROMPT_GROUP_ID.COACH_SUMMARY,
    label: "Coach summary",
    description: "Compress the decision into trackside language.",
    prompts: [
      "Create a coach-ready summary for the rider and crew chief.",
      "Write the radio-safe version of the recommendation.",
      "Summarize risk, expected gain, and validation metric.",
    ],
  },
];

export const PRIMARY_ACTIONS: PrimaryAction[] = [
  {
    label: "Explain PitWall decision",
    prompt: "Explain the current PitWall decision from telemetry to recommendation.",
  },
  {
    label: "Generate validation mission",
    prompt: "Generate a validation mission for traction-control map B.",
  },
  {
    label: "Coach-ready summary",
    prompt: "Create a coach-ready summary for the rider and crew chief.",
  },
];
