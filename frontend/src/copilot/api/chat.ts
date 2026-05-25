import { apiFetch } from './client'
import type { ChatRequest, ChatResponse } from '../types/chat'

export async function sendMessage(
  request: ChatRequest,
  signal?: AbortSignal,
): Promise<ChatResponse> {
  return apiFetch<ChatResponse>('/chat', {
    method: 'POST',
    body: request,
    signal,
  })
}
