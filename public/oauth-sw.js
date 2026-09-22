/* Intercepts Yandex/VK callbacks. Production nginx sends /backend/* to the API,
   which returns raw token JSON. This worker turns that into a session and leaves the page. */
const ACCESS_KEY = "eonage-token";
const REFRESH_KEY = "eonage-refresh-token";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET") return;
  if (!/^\/backend\/auth\/(yandex|vk)\/callback\/?$/.test(url.pathname)) return;
  event.respondWith(handleOauthCallback(event.request));
});

function jsonForScript(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function sessionHtml(accessToken, refreshToken) {
  const data = jsonForScript({
    accessToken,
    refreshToken: refreshToken || "",
    accessKey: ACCESS_KEY,
    refreshKey: REFRESH_KEY,
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

async function handleOauthCallback(request) {
  const failed = new URL("/auth?oauth=failed", request.url).href;
  try {
    const response = await fetch(request.url, {
      method: "GET",
      credentials: "include",
      redirect: "manual",
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (response.type === "opaqueredirect" || (response.status >= 300 && response.status < 400)) {
      const location = response.headers.get("Location");
      if (location) return Response.redirect(new URL(location, request.url).href, 302);
      return fetch(request);
    }

    const type = response.headers.get("content-type") || "";
    if (!type.includes("json")) return response;

    const data = await response.json();
    const access =
      data.access_token || data.accessToken || data.token || data.jwt || "";
    const refresh = data.refresh_token || data.refreshToken || "";
    if (!access) return Response.redirect(failed, 302);

    return new Response(sessionHtml(access, refresh), {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return Response.redirect(failed, 302);
  }
}
