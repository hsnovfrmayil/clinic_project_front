"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { setSession } = useAuth();

  useEffect(() => {
    const token =
      params.get("access_token") ||
      params.get("token") ||
      params.get("jwt");

    if (token) {
      setSession(token, { email: params.get("email") || "" });
      router.replace("/");
      return;
    }

    router.replace("/auth");
  }, [params, router, setSession]);

  return (
    <div className="px-6 py-24 text-center text-sm text-silver">
      Завершаем вход…
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="px-6 py-24 text-center text-sm text-silver">Загрузка…</div>}>
      <CallbackInner />
    </Suspense>
  );
}
