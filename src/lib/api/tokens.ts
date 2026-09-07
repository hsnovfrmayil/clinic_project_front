import type { AuthTokens } from "./types";

function pickString(rec: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = rec[key];
    if (typeof value === "string" && value) return value;
  }
  return "";
}

export function pickTokens(payload: unknown): AuthTokens {
  if (!payload || typeof payload !== "object") {
    return { access_token: "" };
  }
  const rec = payload as Record<string, unknown>;
  return {
    access_token: pickString(rec, "access_token", "accessToken", "token", "jwt"),
    refresh_token: pickString(rec, "refresh_token", "refreshToken") || undefined,
  };
}
