import { API_ORIGIN } from "./config";
import { apiFetch } from "./client";
import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
  VerifyOtpPayload,
} from "./types";

export interface LoginResponse {
  access_token: string;
}

function pickToken(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const rec = payload as Record<string, unknown>;
  const token =
    rec.access_token ?? rec.accessToken ?? rec.token ?? rec.jwt;
  return typeof token === "string" ? token : "";
}

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

export async function login(payload: LoginPayload) {
  const data = await apiFetch<LoginResponse | Record<string, unknown>>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(payload),
      auth: false,
    }
  );
  const access_token = pickToken(data);
  if (!access_token) {
    throw new Error("Токен не получен");
  }
  return { access_token };
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
