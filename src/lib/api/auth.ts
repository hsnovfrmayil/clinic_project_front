import { API_ORIGIN } from "./config";
import { apiFetch } from "./client";
import { pickTokens } from "./tokens";
import type {
  AuthTokens,
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from "./types";

export { pickTokens } from "./tokens";
export { refreshTokens } from "./refresh";
export {
  clearStoredTokens,
  readStoredTokens,
  writeStoredTokens,
} from "./session";

export async function register(payload: RegisterPayload) {
  return apiFetch<unknown>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
    auth: false,
  });
}

export async function verifyOtp(payload: VerifyOtpPayload) {
  return apiFetch<unknown>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(payload),
    auth: false,
  });
}

export async function login(payload: LoginPayload): Promise<AuthTokens> {
  const data = await apiFetch<AuthTokens | Record<string, unknown>>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(payload),
      auth: false,
    }
  );
  const tokens = pickTokens(data);
  if (!tokens.access_token) {
    throw new Error("Токен не получен");
  }
  return tokens;
}

export async function logoutRemote(refresh_token: string) {
  return apiFetch<{ message?: string }>("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refresh_token }),
    auth: false,
  });
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  return apiFetch<{ message?: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
    auth: false,
  });
}

export async function resetPassword(payload: ResetPasswordPayload) {
  return apiFetch<{ message?: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
    auth: false,
  });
}

/** GET /users/me — cari istifadəçi profili (balance daxil) */
export async function fetchMe(token?: string | null) {
  return apiFetch<AuthUser>("/users/me", {
    token: token ?? undefined,
  });
}

/** OAuth must hit the real API origin (redirect), not the local proxy. */
export function oauthStartUrl(provider: "vk" | "yandex") {
  return `${API_ORIGIN}/auth/${provider}`;
}
