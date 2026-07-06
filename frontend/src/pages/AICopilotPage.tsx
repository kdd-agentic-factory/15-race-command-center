import { useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { Bot, CheckCircle2, FileText, Radio, Send, Sparkles, Zap } from "lucide-react";
import { cn } from "../lib/cn";
import { useRaceSession } from "../hooks/useRaceSession";
import {
  sessionBadgeLabel,
  SESSION_BADGE_CLASSES,
} from "../lib/session-badge";
import {
  COPILOT_CONTEXT,
  DECISION_LOOP,
  EVIDENCE_CARDS,
  PRIMARY_ACTIONS,
  PROMPT_GROUPS,
  PROMPT_GROUP_ID,
  type EvidenceCard,
  type PromptGroupId,
} from "../data/copilot-data";
import {
  buildCopilotPayload,
  sendCopilotMessage,
  type AICopilotEvidenceItem,
  type AICopilotSuggestedMission,
} from "../services/aiCopilotClient";
import { type RaceSessionContext } from "../types/race-session";

const CHAT_ROLE = {
  ASSISTANT: "assistant",
  USER: "user",
} as const;

type ChatRole = (typeof CHAT_ROLE)[keyof typeof CHAT_ROLE];

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  confidence?: number;
  evidence?: AICopilotEvidenceItem[];
  suggestedMission?: AICopilotSuggestedMission;
  preview?: boolean;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: "assistant-initial",
  role: CHAT_ROLE.ASSISTANT,
  content:
    "AI Copilot is staged for operational preview. Pick a prompt or ask for a mission-ready explanation of the current PitWall recommendation.",
  confidence: 0.86,
  evidence: EVIDENCE_CARDS.slice(0, 2),
  suggestedMission: {
    title: "Map B traction validation",
    objective: "Validate the recommendation against repeatable T7 exit telemetry before qualifying simulation.",
    validationMetric: "Rear slip delta under +3.0% for two consecutive laps.",
  },
  preview: true,
};

const activePromptGroupClass = "border-kdd-purple/60 bg-kdd-purple-dim text-kdd-text";
const inactivePromptGroupClass =
  "border-kdd-border bg-kdd-surface text-kdd-muted hover:border-kdd-border-bright hover:bg-kdd-hover hover:text-kdd-text";

function makeMessageId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

function evidenceSource(item: EvidenceCard | AICopilotEvidenceItem): string {
  return item.source;
}

function sessionTransportId(session: RaceSessionContext, hasPersistedSession: boolean): string {
  if (!hasPersistedSession) return COPILOT_CONTEXT.sessionId;
  return `${session.circuitId}-${session.riderId}-${session.bikeId}-${session.mode}`;
}

export function AICopilotPage() {
  const { session, hasPersistedSession } = useRaceSession();
  const [activeGroup, setActiveGroup] = useState<PromptGroupId>(PROMPT_GROUP_ID.DECISION_LOOP);
  const [composerValue, setComposerValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isSending, setIsSending] = useState(false);
  const [previewReason, setPreviewReason] = useState("Local preview ready until 16-race-ai-copilot is configured.");

  const selectedPromptGroup =
    PROMPT_GROUPS.find((group) => group.id === activeGroup) ?? PROMPT_GROUPS[0];
  const sessionBadge = sessionBadgeLabel(session, hasPersistedSession);
  const sessionId = sessionTransportId(session, hasPersistedSession);

  const sendMessage = async (message: string) => {
    const trimmed = message.trim();
    if (!trimmed || isSending) return;

    const userMessage: ChatMessage = {
      id: makeMessageId("user"),
      role: CHAT_ROLE.USER,
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setComposerValue("");
    setIsSending(true);

    const result = await sendCopilotMessage(
      buildCopilotPayload(trimmed, {
        session,
        sessionId,
        decisionStage: COPILOT_CONTEXT.decisionStage,
        telemetryEvent: COPILOT_CONTEXT.telemetryEvent,
        priorityItem: COPILOT_CONTEXT.priorityItem,
      }),
    );

    const assistantMessage: ChatMessage = {
      id: makeMessageId("assistant"),
      role: CHAT_ROLE.ASSISTANT,
      content: result.response.answer,
      confidence: result.response.confidence,
      evidence: result.response.evidence,
      suggestedMission: result.response.suggestedMission,
      preview: result.preview,
    };

    setMessages((current) => [...current, assistantMessage]);
    setPreviewReason(result.previewReason);
    setIsSending(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(composerValue);
  };

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(composerValue);
    }
  };

  return (
    <div className="flex flex-col gap-5 bg-kdd-bg text-kdd-text">
      <header className="rounded-kdd-lg border border-kdd-border bg-kdd-card p-5 shadow-kdd-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="font-kdd-mono text-[11px] font-bold uppercase tracking-[0.24em] text-kdd-purple">
              AI Layer · Operational Copilot
            </p>
            <h1 className="mt-2 flex items-center gap-2 text-2xl font-extrabold tracking-tight text-kdd-text">
              <Bot className="h-6 w-6 text-kdd-purple" />
              Race Command Center AI Copilot
            </h1>
            <p className="mt-2 text-sm leading-6 text-kdd-muted">
              Converts PitWall context into explainable decisions, validation missions, evidence packets, and coach-ready summaries for the live race engineering loop.
            </p>
          </div>
          <div className="rounded-kdd-md border border-kdd-purple/40 bg-kdd-purple-dim px-4 py-3 text-sm text-kdd-text">
            <span className="font-kdd-mono text-[10px] uppercase tracking-[0.2em] text-kdd-muted">Session state</span>
            <div className="mt-1 font-kdd-mono text-kdd-purple">{session.mode.toUpperCase()} · {sessionId}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex rounded-kdd-pill border border-kdd-purple/40 bg-kdd-card px-3 py-1 font-kdd-mono text-[10px] font-bold uppercase tracking-[0.18em] text-kdd-purple">
                Preview AI
              </span>
              <span className={SESSION_BADGE_CLASSES}>
                {sessionBadge}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {PRIMARY_ACTIONS.map((action) => (
            <button
              key={action.label}
              type="button"
              className="min-h-[44px] rounded-kdd-md border border-transparent bg-kdd-accent px-4 py-3 text-left text-sm font-bold text-white transition-colors duration-kdd-fast hover:bg-kdd-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-accent"
              onClick={() => void sendMessage(action.prompt)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </header>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
        <main className="flex flex-col gap-5">
          <section className="rounded-kdd-lg border border-kdd-border bg-kdd-card p-5" aria-labelledby="decision-loop-title">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-kdd-mono text-[10px] font-bold uppercase tracking-[0.22em] text-kdd-cyan">Decision loop</p>
                <h2 id="decision-loop-title" className="mt-1 text-lg font-extrabold text-kdd-text">
                  Telemetry → Event → Cause → Recommendation → Mission → Validation
                </h2>
              </div>
              <span className="rounded-kdd-pill border border-kdd-cyan/40 bg-kdd-cyan-dim px-3 py-1 font-kdd-mono text-[11px] text-kdd-cyan">
                current: {COPILOT_CONTEXT.decisionStage}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-6">
              {DECISION_LOOP.map((item) => (
                <article key={item.stage} className="rounded-kdd-md border border-kdd-border bg-kdd-surface p-3">
                  <div className="font-kdd-mono text-[10px] font-bold uppercase tracking-[0.18em] text-kdd-cyan">{item.stage}</div>
                  <h3 className="mt-2 text-sm font-bold text-kdd-text">{item.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-kdd-muted">{item.detail}</p>
                  <span className="mt-3 inline-flex rounded-kdd-pill border border-kdd-border px-2 py-1 font-kdd-mono text-[10px] text-kdd-dim">{item.status}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">
            <aside className="rounded-kdd-lg border border-kdd-border bg-kdd-card p-4" aria-label="Prompt groups">
              <p className="font-kdd-mono text-[10px] font-bold uppercase tracking-[0.22em] text-kdd-purple">Prompt groups</p>
              <div className="mt-3 grid gap-2">
                {PROMPT_GROUPS.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    className={cn(
                      "min-h-[44px] rounded-kdd-md border px-3 py-3 text-left transition-colors duration-kdd-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-accent",
                      activeGroup === group.id ? activePromptGroupClass : inactivePromptGroupClass,
                    )}
                    aria-pressed={activeGroup === group.id}
                    onClick={() => setActiveGroup(group.id)}
                  >
                    <span className="block text-sm font-bold">{group.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-kdd-dim">{group.description}</span>
                  </button>
                ))}
              </div>
            </aside>

            <section className="rounded-kdd-lg border border-kdd-border bg-kdd-card p-4" aria-labelledby="workspace-title">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-kdd-mono text-[10px] font-bold uppercase tracking-[0.22em] text-kdd-purple">Workspace</p>
                  <h2 id="workspace-title" className="mt-1 text-lg font-extrabold text-kdd-text">{selectedPromptGroup.label}</h2>
                </div>
                <span className="rounded-kdd-pill border border-kdd-border px-3 py-1 font-kdd-mono text-[11px] text-kdd-muted">{previewReason}</span>
              </div>

              <div className="mt-4 grid gap-2">
                {selectedPromptGroup.prompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="min-h-[44px] rounded-kdd-md border border-kdd-border bg-kdd-surface px-3 py-3 text-left text-sm text-kdd-text transition-colors duration-kdd-fast hover:border-kdd-purple/50 hover:bg-kdd-purple-dim focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-accent"
                    onClick={() => void sendMessage(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="mt-4 max-h-[460px] overflow-y-auto rounded-kdd-md border border-kdd-border bg-kdd-bg p-3" aria-label="Copilot conversation">
                <div className="grid gap-3">
                  {messages.map((message) => (
                    <article
                      key={message.id}
                      className={cn(
                        "rounded-kdd-md border p-3",
                        message.role === CHAT_ROLE.USER
                          ? "border-kdd-cyan/35 bg-kdd-cyan-dim"
                          : "border-kdd-border bg-kdd-surface",
                      )}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-kdd-mono text-[10px] font-bold uppercase tracking-[0.18em] text-kdd-muted">
                          {message.role === CHAT_ROLE.USER ? "Race engineer" : "AI Copilot"}
                        </span>
                        {typeof message.confidence === "number" && (
                          <span className="rounded-kdd-pill border border-kdd-border px-2 py-1 font-kdd-mono tabular-nums text-[10px] text-kdd-cyan">
                            confidence {Math.round(message.confidence * 100)}%
                          </span>
                        )}
                      </div>
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-kdd-text">{message.content}</p>

                      {message.suggestedMission && (
                        <div className="mt-3 rounded-kdd-md border border-kdd-purple/35 bg-kdd-purple-dim p-3">
                          <div className="flex items-center gap-2 text-sm font-bold text-kdd-text"><Sparkles className="h-4 w-4 text-kdd-purple" />{message.suggestedMission.title}</div>
                          <p className="mt-2 text-xs leading-5 text-kdd-muted">{message.suggestedMission.objective}</p>
                          <p className="mt-2 font-kdd-mono text-[11px] text-kdd-purple">Metric: {message.suggestedMission.validationMetric}</p>
                        </div>
                      )}
                    </article>
                  ))}
                  {isSending && (
                    <div className="rounded-kdd-md border border-kdd-border bg-kdd-surface p-3 font-kdd-mono text-xs text-kdd-muted">
                      Copilot is evaluating the decision loop…
                    </div>
                  )}
                </div>
              </div>

              <form className="mt-4" onSubmit={handleSubmit}>
                <label htmlFor="ai-copilot-composer" className="sr-only">Ask AI Copilot</label>
                <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                  <textarea
                    id="ai-copilot-composer"
                    value={composerValue}
                    onChange={(event) => setComposerValue(event.target.value)}
                    onKeyDown={handleComposerKeyDown}
                    rows={3}
                    className="min-h-[96px] resize-y rounded-kdd-md border border-kdd-border bg-kdd-surface px-3 py-3 text-sm text-kdd-text placeholder:text-kdd-dim focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-accent"
                    placeholder="Ask for an explanation, mission, evidence review, or coach summary. Enter sends; Shift+Enter inserts a newline."
                  />
                  <button
                    type="submit"
                    disabled={isSending || composerValue.trim().length === 0}
                    className="min-h-[44px] rounded-kdd-md border border-transparent bg-kdd-accent px-5 py-3 font-bold text-white transition-colors duration-kdd-fast hover:bg-kdd-accent-hover disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kdd-accent"
                  >
                    <span className="inline-flex items-center gap-2"><Send className="h-4 w-4" />Send</span>
                  </button>
                </div>
              </form>
            </section>
          </section>
        </main>

        <aside className="flex flex-col gap-5" aria-label="Copilot context sidebar">
          <section className="rounded-kdd-lg border border-kdd-border bg-kdd-card p-4">
            <p className="font-kdd-mono text-[10px] font-bold uppercase tracking-[0.22em] text-kdd-cyan">Context sidebar</p>
            <div className="mt-3 grid gap-3 text-sm">
              <div className="rounded-kdd-md border border-kdd-border bg-kdd-surface p-3"><span className="block text-kdd-dim">Node</span><strong className="font-kdd-mono text-kdd-text">{COPILOT_CONTEXT.nodeId}</strong></div>
              <div className="rounded-kdd-md border border-kdd-border bg-kdd-surface p-3"><span className="block text-kdd-dim">Circuit</span><strong className="font-kdd-mono text-kdd-text">{session.circuitName}</strong><span className="mt-1 block font-kdd-mono tabular-nums text-[11px] text-kdd-cyan">{session.circuitId} · confidence {session.circuitConfidence}%</span></div>
              <div className="rounded-kdd-md border border-kdd-border bg-kdd-surface p-3"><span className="block text-kdd-dim">Rider</span><strong className="font-kdd-mono text-kdd-text">{session.riderName}</strong><span className="mt-1 block font-kdd-mono text-[11px] text-kdd-muted">{session.riderId}</span></div>
              <div className="rounded-kdd-md border border-kdd-border bg-kdd-surface p-3"><span className="block text-kdd-dim">Bike</span><strong className="font-kdd-mono text-kdd-text">{session.bikeName}</strong><span className="mt-1 block font-kdd-mono text-[11px] text-kdd-muted">{session.bikeId}</span></div>
              <div className="rounded-kdd-md border border-kdd-border bg-kdd-surface p-3"><span className="block text-kdd-dim">Mode / Source</span><strong className="font-kdd-mono text-kdd-text">{session.mode} · {session.dataSource}</strong><span className="mt-1 block font-kdd-mono text-[11px] text-kdd-muted">telemetry {session.telemetryStatus}</span></div>
              <div className="rounded-kdd-md border border-kdd-border bg-kdd-surface p-3"><span className="block text-kdd-dim">Active modules</span><strong className="font-kdd-mono text-kdd-text">{session.activeModules.join(" · ")}</strong></div>
              <div className="rounded-kdd-md border border-kdd-cyan/35 bg-kdd-cyan-dim p-3"><span className="block text-kdd-dim">Telemetry event</span><strong className="text-kdd-cyan">{COPILOT_CONTEXT.telemetryEvent}</strong></div>
            </div>
          </section>

          <section className="rounded-kdd-lg border border-kdd-border bg-kdd-card p-4" aria-labelledby="evidence-title">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-kdd-cyan" />
              <h2 id="evidence-title" className="text-sm font-bold text-kdd-text">Evidence cards</h2>
            </div>
            <div className="mt-3 grid gap-3">
              {EVIDENCE_CARDS.map((item) => (
                <article key={`${item.label}-${item.source}`} className="rounded-kdd-md border border-kdd-border bg-kdd-surface p-3">
                  <p className="font-kdd-mono text-[10px] font-bold uppercase tracking-[0.18em] text-kdd-dim">{item.label}</p>
                  <p className="mt-1 text-sm font-bold text-kdd-text">{item.value}</p>
                  <p className="mt-2 text-xs text-kdd-muted">Source: {evidenceSource(item)}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-kdd-lg border border-kdd-border bg-kdd-card p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-kdd-text"><Radio className="h-4 w-4 text-kdd-purple" />Preview contract</div>
            <ul className="mt-3 grid gap-2 text-xs leading-5 text-kdd-muted">
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-kdd-green" />POST /api/copilot/message prepared for 16-race-ai-copilot.</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-kdd-green" />Local fallback protects this UI when service 16 is unavailable.</li>
              <li className="flex gap-2"><Zap className="mt-0.5 h-4 w-4 text-kdd-cyan" />Payload includes session, rider, bike, circuit, mode, and decision context.</li>
            </ul>
          </section>
        </aside>
      </section>
    </div>
  );
}
