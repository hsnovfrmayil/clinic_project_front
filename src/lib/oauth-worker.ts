export function ensureOauthWorker() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return Promise.resolve();
  }
  return navigator.serviceWorker
    .register("/oauth-sw.js", { scope: "/", updateViaCache: "none" })
    .then(() => navigator.serviceWorker.ready)
    .then(() => undefined)
    .catch(() => undefined);
}
