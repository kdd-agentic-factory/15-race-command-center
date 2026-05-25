import { create } from 'zustand'
import type {
  Message,
  ChatRequest,
  ChatResponse,
  SessionContext,
} from '../types/chat'
import { sendMessage as apiSendMessage } from '../api/chat'

let messageCounter = 0
function nextId(): string {
  messageCounter += 1
  return `msg-${Date.now()}-${messageCounter}`
}

function now(): string {
  return new Date().toISOString()
}

export interface ChatState {
  messages: Message[]
  conversationId: string | null
  sessionId: string
  isLoading: boolean
  error: string | null
  streamingContent: string | null
  evidenceDrawerOpen: boolean
  approvalModalOpen: boolean
  pendingResponse: ChatResponse | null
  model: string
  sessionContext: SessionContext
  sendMessage: (content: string) => Promise<void>
  addMessage: (msg: Omit<Message, 'id' | 'created_at'>) => string
  clearMessages: () => void
  setModel: (model: string) => void
  setSessionContext: (ctx: Partial<SessionContext>) => void
  toggleEvidenceDrawer: () => void
  approveAction: () => void
  rejectAction: () => void
}

const DEFAULT_SESSION_ID = `session-${Date.now()}`
const DEFAULT_MODEL = 'qwen2.5:7b'

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  conversationId: null,
  sessionId: DEFAULT_SESSION_ID,
  isLoading: false,
  error: null,
  streamingContent: null,
  evidenceDrawerOpen: false,
  approvalModalOpen: false,
  pendingResponse: null,
  model: DEFAULT_MODEL,
  sessionContext: {
    circuit: 'Jerez',
    session_type: 'Practice',
    session_id: DEFAULT_SESSION_ID,
  },

  addMessage: (msg) => {
    const id = nextId()
    const message: Message = { ...msg, id, created_at: now() }
    set((s) => ({ messages: [...s.messages, message] }))
    return id
  },

  sendMessage: async (content: string) => {
    const { conversationId, sessionId, model, addMessage } = get()

    if (get().isLoading) return

    addMessage({ role: 'user', content })
    set({ isLoading: true, error: null, streamingContent: '' })

    try {
      const payload: ChatRequest = {
        conversation_id: conversationId,
        session_id: sessionId,
        message: content,
        model,
        require_evidence: true,
        stream: false,
        context: {},
      }

      const response = await apiSendMessage(payload)

      if (!conversationId && response.conversation_id) {
        set({ conversationId: response.conversation_id })
      }

      addMessage({
        role: 'assistant',
        content: response.answer,
        tool_calls: response.tool_calls,
        evidence: response.evidence,
        recommendations: response.recommendations,
        approval_required: response.approval_required,
        approver_role: response.approver_role,
        confidence: response.confidence,
        uncertainty: response.uncertainty,
        next_actions: response.next_actions,
        conversation_id: response.conversation_id,
        message_id: response.message_id,
      })

      if (response.approval_required) {
        set({ approvalModalOpen: true, pendingResponse: response })
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred'
      set({ error: message })
    } finally {
      set({ isLoading: false, streamingContent: null })
    }
  },

  clearMessages: () =>
    set({
      messages: [],
      conversationId: null,
      error: null,
      streamingContent: null,
    }),

  setModel: (model: string) => set({ model }),

  setSessionContext: (ctx: Partial<SessionContext>) =>
    set((s) => ({ sessionContext: { ...s.sessionContext, ...ctx } })),

  toggleEvidenceDrawer: () =>
    set((s) => ({ evidenceDrawerOpen: !s.evidenceDrawerOpen })),

  approveAction: () => {
    set({ approvalModalOpen: false, pendingResponse: null })
  },

  rejectAction: () => {
    set({ approvalModalOpen: false, pendingResponse: null })
  },
}))
