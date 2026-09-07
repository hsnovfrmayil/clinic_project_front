import { API_ORIGIN } from "./config";
import { pickTokens } from "./tokens";
import type { AuthTokens } from "./types";

/** Refresh access token. Uses raw fetch to avoid apiFetch retry recursion. */
export async function refreshTokens(
  refresh_token: string
): Promise<AuthTokens> {
  const base =
    typeof window === "undefined"
      ? API_ORIGIN
      : (process.env.NEXT_PUBLIC_API_PROXY || "/backend").replace(/\/$/, "");

  const res = await fetch(`${base}/auth/refresh`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token }),
    cache: "no-store",
  });

  const text = await res.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!res.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      typeof (payload as { message?: unknown }).message === "string"
        ? (payload as { message: string }).message
        : "Refresh token yanlış / vaxtı bitib";
    throw new Error(message);
  }

  const tokens = pickTokens(payload);
  if (!tokens.access_token) {
    throw new Error("Токен не получен");
  }
  return tokens;
}
