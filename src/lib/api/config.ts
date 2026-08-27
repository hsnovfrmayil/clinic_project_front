/** Absolute backend origin (server + OAuth redirects). */
export const API_ORIGIN = (
  process.env.API_SERVER_URL ||
  process.env.NEXT_PUBLIC_API_ORIGIN ||
  "https://api.eonage.ru"
).replace(/\/$/, "");

/**
 * Browser calls same-origin `/backend/*` (Next rewrite) to avoid CORS.
 * Server Components call the absolute API origin.
 */
export function getApiBase() {
  if (typeof window === "undefined") return API_ORIGIN;
  return (process.env.NEXT_PUBLIC_API_PROXY || "/backend").replace(/\/$/, "");
}

/** @deprecated use getApiBase() — kept for simple imports */
export const API_URL = API_ORIGIN;

export const MEDIA_URL = (
  process.env.NEXT_PUBLIC_MEDIA_URL || API_ORIGIN
).replace(/\/$/, "");

export const AUTH_TOKEN_KEY = "eonage-token";
export const AUTH_USER_KEY = "eonage-user";
