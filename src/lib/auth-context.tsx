"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AUTH_USER_KEY } from "./api/config";
import * as authApi from "./api/auth";
import type {
  AuthUser,
  LoginPayload,
  OtpChannel,
  RegisterPayload,
  VerifyOtpPayload,
} from "./api/types";

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  hydrated: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  verifyOtp: (payload: VerifyOtpPayload) => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (
    email: string,
    otp: string,
    newPassword: string
  ) => Promise<string>;
  refreshUser: () => Promise<AuthUser | null>;
  setSession: (
    token: string,
    user?: AuthUser | null,
    refreshToken?: string | null
  ) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function persistUser(nextUser: AuthUser | null) {
  try {
    if (nextUser) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
    else localStorage.removeItem(AUTH_USER_KEY);
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const persist = useCallback(
    (
      nextToken: string | null,
      nextUser: AuthUser | null,
      refreshToken?: string | null
    ) => {
      setToken(nextToken);
      setUser(nextUser);
      authApi.writeStoredTokens(nextToken, refreshToken);
      persistUser(nextUser);
    },
    []
  );

  const refreshUser = useCallback(
    async (overrideToken?: string | null) => {
      const active = overrideToken ?? token;
      if (!active) {
        persist(null, null, null);
        return null;
      }
      try {
        const profile = await authApi.fetchMe(active);
        const { refresh_token } = authApi.readStoredTokens();
        persist(active, profile, refresh_token);
        return profile;
      } catch {
        persist(null, null, null);
        return null;
      }
    },
    [persist, token]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { access_token: savedToken, refresh_token } =
          authApi.readStoredTokens();
        const raw = localStorage.getItem(AUTH_USER_KEY);
        const cached = raw ? (JSON.parse(raw) as AuthUser) : null;

        if (!savedToken) {
          if (!cancelled) {
            setToken(null);
            setUser(null);
            setHydrated(true);
          }
          return;
        }

        if (!cancelled) {
          setToken(savedToken);
          if (cached) setUser(cached);
        }

        try {
          const profile = await authApi.fetchMe(savedToken);
          if (!cancelled) persist(savedToken, profile, refresh_token);
        } catch {
          if (refresh_token) {
            try {
              const tokens = await authApi.refreshTokens(refresh_token);
              const profile = await authApi.fetchMe(tokens.access_token);
              if (!cancelled) {
                persist(
                  tokens.access_token,
                  profile,
                  tokens.refresh_token ?? refresh_token
                );
              }
              return;
            } catch {
              // fall through
            }
          }
          if (!cancelled) persist(null, null, null);
        }
      } catch {
        if (!cancelled) persist(null, null, null);
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [persist]);

  const setSession = useCallback(
    (
      nextToken: string,
      nextUser?: AuthUser | null,
      refreshToken?: string | null
    ) => {
      const existing = authApi.readStoredTokens().refresh_token;
      persist(nextToken, nextUser ?? user, refreshToken ?? existing);
      void authApi
        .fetchMe(nextToken)
        .then((profile) =>
          persist(nextToken, profile, refreshToken ?? existing)
        )
        .catch(() => {
          /* keep token; profile optional until next refresh */
        });
    },
    [persist, user]
  );

  const login = useCallback(
    async (payload: LoginPayload) => {
      const tokens = await authApi.login(payload);
      persist(tokens.access_token, { email: payload.email }, tokens.refresh_token ?? null);
      const profile = await authApi.fetchMe(tokens.access_token);
      persist(tokens.access_token, profile, tokens.refresh_token ?? null);
    },
    [persist]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const channel: OtpChannel = payload.channel ?? "email";
      await authApi.register({ ...payload, channel });
      persist(null, {
        email: payload.email,
        first_name: payload.first_name,
        last_name: payload.last_name,
        phone: payload.phone,
        gender: payload.gender ?? null,
        birth_date: payload.birth_date ?? null,
      }, null);
    },
    [persist]
  );

  const verifyOtp = useCallback(async (payload: VerifyOtpPayload) => {
    await authApi.verifyOtp(payload);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    const res = await authApi.forgotPassword({ email });
    return (
      res?.message ||
      "Если email зарегистрирован, код подтверждения отправлен"
    );
  }, []);

  const resetPassword = useCallback(
    async (email: string, otp: string, newPassword: string) => {
      const res = await authApi.resetPassword({
        email,
        otp,
        new_password: newPassword,
      });
      return res?.message || "Пароль успешно обновлён";
    },
    []
  );

  const logout = useCallback(async () => {
    const { refresh_token } = authApi.readStoredTokens();
    if (refresh_token) {
      try {
        await authApi.logoutRemote(refresh_token);
      } catch {
        // still clear local session
      }
    }
    persist(null, null, null);
  }, [persist]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      hydrated,
      isAuthenticated: Boolean(token),
      login,
      register,
      verifyOtp,
      forgotPassword,
      resetPassword,
      refreshUser: () => refreshUser(),
      setSession,
      logout,
    }),
    [
      token,
      user,
      hydrated,
      login,
      register,
      verifyOtp,
      forgotPassword,
      resetPassword,
      refreshUser,
      setSession,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
