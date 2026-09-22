import type { NextRequest } from "next/server";
import { completeOauthCallback } from "@/lib/api/oauth-callback";

export async function GET(request: NextRequest) {
  return completeOauthCallback(request, "vk");
}
