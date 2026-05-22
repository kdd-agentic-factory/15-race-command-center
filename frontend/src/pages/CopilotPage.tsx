import { useState, useRef, useEffect } from "react";
import { Send, Bot } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  evidence?: { source: string; type: string; confidence: number }[];
  tool_calls?: { tool: string; status: string; approval_required: boolean }[];
  approval_status?: string;
};

const QUICK_QUESTIONS = [
  "Analiza la degradación del neumático trasero en la última tanda.",
  "Compara el setup base con el setup propuesto para clasificación.",
  "Explícame por qué recomiendas cambiar el rebote trasero.",
  "Genera un informe pre-GP para el circuito de Jerez.",
  "Busca patrones de spin similares en sesiones anteriores.",
  "¿Qué pieza específica podríamos diseñar para mejorar la refrigeración del freno delantero?",
];

async function askCopilot(question: string): Promise<Message> {
  try {
    const res = await fetch("/api/copilot/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        session_id: "jerez-fp2-2026-05-03",
        circuit: "Jerez",
      }),
    });
    const data = await res.json();
    return {
      role: "assistant",
      content: data.answer,
      evidence: data.evidence,
      tool_calls: data.tool_calls,
      approval_status: data.approval_status,
    };
  } catch {
    return {
      role: "assistant",
      content: "Copilot service unavailable. Connect to 16-race-ai-copilot for live responses.",
      evidence: [],
      tool_calls: [],
      approval_status: "blocked",
    };
  }
}

export function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Ready to route Command Center questions through 16-race-ai-copilot with RAG/CAG, MCP tools, orchestrator metadata, and approval gates.",
      evidence: [],
      tool_calls: [],
      approval_status: "not_required",
    },
  ]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const send = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed || loading) return;
    setMessages((m) => [...m, { role: "user", content: trimmed }]);
    setQuery("");
    setLoading(true);
    const reply = await askCopilot(trimmed);
    setMessages((m) => [...m, reply]);
    setLoading(false);
  };

  return (
    <div className="flex h-full flex-col space-y-4">
      <header>
        <p className="eyebrow">AI Copilot</p>
        <h1 className="mt-2 text-3xl font-semibold">Evidence-grounded race assistant</h1>
        <p className="mt-2 text-zinc-400">
          Routed through 16-race-ai-copilot → RAG/CAG → MCP Gateway → Orchestrator
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel flex flex-col lg:col-span-2" style={{ minHeight: 480 }}>
          <div ref={chatRef} className="flex-1 overflow-y-auto space-y-4 pr-1" style={{ maxHeight: 380 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <span className="text-[11px] text-zinc-600">
                  {msg.role === "user" ? "You" : "AI Copilot"}
                </span>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-red-600 text-white"
                      : "bg-zinc-900 text-zinc-200"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "assistant" && msg.evidence && msg.evidence.length > 0 && (
                  <div className="mt-1 max-w-[85%] space-y-0.5">
                    {msg.evidence.map((e, j) => (
                      <p key={j} className="text-[11px] text-zinc-500">
                        {e.source} · {e.type} · conf {e.confidence}
                      </p>
                    ))}
                  </div>
                )}
                {msg.role === "assistant" && msg.approval_status && msg.approval_status !== "not_required" && (
                  <span className={msg.approval_status === "required" ? "badge-warn" : "badge-neutral"}>
                    approval: {msg.approval_status}
                  </span>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Bot className="h-4 w-4 animate-pulse" />
                Routing evidence…
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(query); }}
            className="mt-4 flex gap-2"
          >
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(query); } }}
              placeholder="Ask the race engineering copilot..."
              rows={2}
              className="flex-1 resize-none rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-600"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="panel">
            <h3 className="text-sm font-semibold text-zinc-400 mb-3">Quick Questions</h3>
            <div className="space-y-1.5">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-left text-xs text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="panel">
            <h3 className="text-sm font-semibold text-zinc-400 mb-3">Evidence Route</h3>
            <div className="space-y-1.5">
              {["15 Command Center", "16 AI Copilot", "03 RAG/CAG", "02 MCP Gateway", "01 Orchestrator", "15 APIs"].map((step) => (
                <div key={step} className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="h-1 w-1 rounded-full bg-red-500 flex-shrink-0" />
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
