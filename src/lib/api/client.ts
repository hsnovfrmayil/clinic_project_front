import {
  AUTH_REFRESH_KEY,
  AUTH_TOKEN_KEY,
  getApiBase,
} from "./config";
import { refreshTokens } from "./refresh";
import { clearStoredTokens, writeStoredTokens } from "./session";

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export function isApiError(err: unknown): err is ApiError {
  return (
    err instanceof ApiError ||
    (typeof err === "object" &&
      err !== null &&
      (err as { name?: string }).name === "ApiError" &&
      typeof (err as { status?: unknown }).status === "number")
  );
}

function readToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

function readRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(AUTH_REFRESH_KEY);
  } catch {
    return null;
  }
}

function nestMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") return fallback;
  const message = (payload as { message?: unknown }).message;
  if (typeof message === "string" && message.trim()) return message;
  if (Array.isArray(message) && message.length) {
    return message.filter((m) => typeof m === "string").join(". ");
  }
  return fallback;
}

export function toErrorMessage(
  err: unknown,
  fallback = "Не удалось выполнить запрос"
) {
  if (isApiError(err)) return err.message || fallback;
  if (err instanceof Error && err.message) {
    if (/failed to fetch|networkerror|load failed/i.test(err.message)) {
      return "Нет связи с сервером. Проверьте интернет или CORS/proxy.";
    }
    return err.message;
  }
  return fallback;
}

let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refresh = readRefreshToken();
  if (!refresh) return null;

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const tokens = await refreshTokens(refresh);
        writeStoredTokens(tokens.access_token, tokens.refresh_token ?? refresh);
        return tokens.access_token;
      } catch {
        clearStoredTokens();
        return null;
      } finally {
        refreshInFlight = null;
      }
    })();
  }

  return refreshInFlight;
}

function shouldAttemptRefresh(path: string, auth: boolean | undefined) {
  if (auth === false) return false;
  if (/\/auth\/(login|refresh|logout|register|verify-otp|forgot-password|reset-password)/.test(path)) {
    return false;
  }
  return true;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit & {
    auth?: boolean;
    token?: string | null;
    _retried?: boolean;
  } = {}
): Promise<T> {
  const { auth, token, headers, _retried, ...rest } = init;
  const base = getApiBase();
  const url = path.startsWith("http") ? path : `${base}${path}`;

  const nextHeaders = new Headers(headers);
  if (!nextHeaders.has("Accept")) nextHeaders.set("Accept", "application/json");
  if (rest.body && !nextHeaders.has("Content-Type")) {
    nextHeaders.set("Content-Type", "application/json");
  }

  const bearer = token ?? (auth === false ? null : readToken());
  if (bearer) nextHeaders.set("Authorization", `Bearer ${bearer}`);

  let res: Response;
  try {
    res = await fetch(url, {
      ...rest,
      headers: nextHeaders,
      cache: rest.cache ?? "no-store",
    });
  } catch (err) {
    throw new ApiError(toErrorMessage(err), 0, err);
  }

  const text = await res.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (
    res.status === 401 &&
    !_retried &&
    shouldAttemptRefresh(path, auth) &&
    typeof window !== "undefined"
  ) {
    const nextAccess = await refreshAccessToken();
    if (nextAccess) {
      return apiFetch<T>(path, {
        ...init,
        token: nextAccess,
        _retried: true,
      });
    }
  }

  if (!res.ok) {
    throw new ApiError(
      nestMessage(payload, res.statusText || "Request failed"),
      res.status,
      payload
    );
  }

  return payload as T;
}

export function toQuery(params: Record<string, unknown>): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item === undefined || item === null || item === "") continue;
        search.append(key, String(item));
      }
      continue;
    }
    if (typeof value === "boolean") {
      search.set(key, value ? "true" : "false");
      continue;
    }
    search.set(key, String(value));
  }

  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
