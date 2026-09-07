import { AUTH_REFRESH_KEY, AUTH_TOKEN_KEY } from "./config";

export function readStoredTokens() {
  if (typeof window === "undefined") {
    return {
      access_token: null as string | null,
      refresh_token: null as string | null,
    };
  }
  try {
    return {
      access_token: localStorage.getItem(AUTH_TOKEN_KEY),
      refresh_token: localStorage.getItem(AUTH_REFRESH_KEY),
    };
  } catch {
    return { access_token: null, refresh_token: null };
  }
}

export function writeStoredTokens(
  access_token: string | null,
  refresh_token?: string | null
) {
  if (typeof window === "undefined") return;
  try {
    if (access_token) localStorage.setItem(AUTH_TOKEN_KEY, access_token);
    else localStorage.removeItem(AUTH_TOKEN_KEY);

    if (refresh_token === undefined) return;
    if (refresh_token) localStorage.setItem(AUTH_REFRESH_KEY, refresh_token);
    else localStorage.removeItem(AUTH_REFRESH_KEY);
  } catch {
    // ignore
  }
}

export function clearStoredTokens() {
  writeStoredTokens(null, null);
}
