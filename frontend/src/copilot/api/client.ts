const BASE_URL = '/copilot-api'
const AUTH_TOKEN_KEY = "rcc_auth_token";

function readAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

interface RequestOptions {
  method?: string
  headers?: Record<string, string>
  body?: unknown
  signal?: AbortSignal
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', headers = {}, body, signal } = options

  const url = `${BASE_URL}${path}`
  const token = readAuthToken()

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  })

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`
    try {
      const errBody = await response.json()
      if (errBody.detail) {
        errorMessage = errBody.detail
      }
    } catch {
      // ignore parse errors
    }
    throw new ApiError(response.status, errorMessage)
  }

  return response.json() as Promise<T>
}
