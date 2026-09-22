import { NextRequest, NextResponse } from "next/server";
import { API_ORIGIN, AUTH_REFRESH_KEY, AUTH_TOKEN_KEY } from "./config";
import { pickTokens } from "./tokens";

const PROVIDERS = new Set(["yandex", "vk"]);

function jsonForScript(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function sessionHandoffHtml(accessToken: string, refreshToken?: string) {
  const data = jsonForScript({
    accessToken,
    refreshToken: refreshToken || "",
    accessKey: AUTH_TOKEN_KEY,
    refreshKey: AUTH_REFRESH_KEY,
  });

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8" />
<meta name="referrer" content="no-referrer" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Вход — EONAGE</title>
<style>
  html, body { margin: 0; height: 100%; background: #090b0f; color: #c5ced6; }
  body { display: grid; place-items: center; font: 14px/1.4 system-ui, sans-serif; }
</style>
</head>
<body>
<p>Завершаем вход…</p>
<script>
(function () {
  var data = ${data};
  try {
    localStorage.setItem(data.accessKey, data.accessToken);
    if (data.refreshToken) localStorage.setItem(data.refreshKey, data.refreshToken);
  } catch (e) {}
  location.replace("/");
})();
</script>
</body>
</html>`;
}

export async function completeOauthCallback(
  request: NextRequest,
  provider: string
) {
  const failed = new URL("/auth?oauth=failed", request.url);
  if (!PROVIDERS.has(provider)) {
    return NextResponse.redirect(failed);
  }

  const upstreamUrl = new URL(`${API_ORIGIN}/auth/${provider}/callback`);
  upstreamUrl.search = request.nextUrl.search;

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, {
      redirect: "manual",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent": request.headers.get("user-agent") || "eonage-web",
      },
    });
  } catch {
    return NextResponse.redirect(failed);
  }

  if (upstream.status >= 300 && upstream.status < 400) {
    const location = upstream.headers.get("location");
    if (location) {
      return NextResponse.redirect(new URL(location, upstreamUrl));
    }
  }

  let tokens = pickTokens(null);
  try {
    tokens = pickTokens(JSON.parse(await upstream.text()));
  } catch {
    tokens = pickTokens(null);
  }

  if (!upstream.ok || !tokens.access_token) {
    return NextResponse.redirect(failed);
  }

  return new NextResponse(
    sessionHandoffHtml(tokens.access_token, tokens.refresh_token),
    {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
      },
    }
  );
}
