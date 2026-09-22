"use client";

import { useEffect } from "react";
import { ensureOauthWorker } from "@/lib/oauth-worker";

export default function OAuthCallbackBridge() {
  useEffect(() => {
    void ensureOauthWorker();
  }, []);
  return null;
}
