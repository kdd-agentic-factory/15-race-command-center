const BASE = "/api";
const AUTH_TOKEN_KEY = "rcc_auth_token";

function readAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

function buildHeaders(extra?: HeadersInit): HeadersInit {
  const token = readAuthToken();
  return token
    ? { ...extra, Authorization: `Bearer ${token}` }
    : extra ?? {};
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function setAuthToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, token.trim());
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getAuthToken() {
  return readAuthToken();
}

async function handleResponse<T>(res: Response, method: string, path: string): Promise<T> {
  if (res.status === 401) {
    clearAuthToken();
    window.location.href = "/settings";
    throw new ApiError(401, "Session expired — please re-authenticate");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.detail ?? `${method} ${path} → ${res.status}`);
  }
  return res.json();
}

export async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { headers: buildHeaders() });
  return handleResponse<T>(res, "GET", path);
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res, "POST", path);
}

export async function patch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "PATCH",
    headers: buildHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res, "PATCH", path);
}
