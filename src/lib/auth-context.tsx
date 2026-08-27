"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "./api/config";
import * as authApi from "./api/auth";
import type { AuthUser, LoginPayload, RegisterPayload } from "./api/types";

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  hydrated: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
  setSession: (token: string, user?: AuthUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const persist = useCallback(
    (nextToken: string | null, nextUser: AuthUser | null) => {
      setToken(nextToken);
      setUser(nextUser);
      try {
        if (nextToken) localStorage.setItem(AUTH_TOKEN_KEY, nextToken);
        else localStorage.removeItem(AUTH_TOKEN_KEY);
        if (nextUser)
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
        else localStorage.removeItem(AUTH_USER_KEY);
      } catch {
        // ignore
      }
    },
    []
  );

  const refreshUser = useCallback(
    async (overrideToken?: string | null) => {
      const active = overrideToken ?? token;
      if (!active) {
        persist(null, null);
        return null;
      }
      try {
        const profile = await authApi.fetchMe(active);
        persist(active, profile);
        return profile;
      } catch {
        persist(null, null);
        return null;
      }
    },
    [persist, token]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
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
          if (!cancelled) persist(savedToken, profile);
        } catch {
          if (!cancelled) persist(null, null);
        }
      } catch {
        if (!cancelled) persist(null, null);
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [persist]);

  const setSession = useCallback(
    (nextToken: string, nextUser?: AuthUser | null) => {
      persist(nextToken, nextUser ?? user);
      void authApi
        .fetchMe(nextToken)
        .then((profile) => persist(nextToken, profile))
        .catch(() => {
          /* keep token; profile optional until next refresh */
        });
    },
    [persist, user]
  );

  const login = useCallback(
    async (payload: LoginPayload) => {
      const { access_token } = await authApi.login(payload);
      persist(access_token, {
        email: payload.email,
      });
      const profile = await authApi.fetchMe(access_token);
      persist(access_token, profile);
    },
    [persist]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      await authApi.register(payload);
      persist(null, {
        email: payload.email,
        first_name: payload.first_name,
        last_name: payload.last_name,
        phone: payload.phone,
        gender: payload.gender ?? null,
        birth_date: payload.birth_date ?? null,
      });
    },
    [persist]
  );

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    await authApi.verifyOtp({ email, otp });
  }, []);

  const logout = useCallback(() => persist(null, null), [persist]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      hydrated,
      isAuthenticated: Boolean(token),
      login,
      register,
      verifyOtp,
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
