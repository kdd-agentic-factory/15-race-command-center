export interface ToolCallRecord {
  tool_name: string
  parameters: Record<string, unknown>
  result: unknown | null
  timestamp: string
}

export interface EvidenceItem {
  id: string
  title: string
  url_or_path: string
  snippet: string
}

export interface EvidencePacket {
  sources: EvidenceItem[]
  raw_data: string[]
  groundedness_score: number
}

export interface Recommendation {
  action: string
  rationale: string
  parameters: Record<string, unknown>
}

export interface ChatRequest {
  conversation_id?: string | null
  session_id?: string | null
  message: string
  model?: string | null
  require_evidence?: boolean
  stream?: boolean
  context?: Record<string, unknown>
}

export interface ChatResponse {
  conversation_id: string
  message_id: string
  answer: string
  confidence: number
  evidence: EvidenceItem[]
  tool_calls: ToolCallRecord[]
  recommendations: Recommendation[]
  approval_required: boolean
  approver_role: string | null
  uncertainty: string | null
  next_actions: string[]
}

export type MessageRole = 'user' | 'assistant'

export interface Message {
  id: string
  role: MessageRole
  content: string
  tool_calls?: ToolCallRecord[]
  evidence?: EvidenceItem[]
  recommendations?: Recommendation[]
  approval_required?: boolean
  approver_role?: string | null
  confidence?: number
  uncertainty?: string | null
  next_actions?: string[]
  conversation_id?: string
  message_id?: string
  created_at: string
}

export interface SessionContext {
  circuit?: string
  session_type?: string
  session_id?: string
  driver?: string
  car_number?: string
}
