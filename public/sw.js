// MindReset Kathu — Service Worker (Gate 3 stub).
// Gate 5 will add: precache of app shell, Workbox runtime caching for
// content, background-sync queue for quest completions and journal entries,
// and Web Push handling via VAPID.
//
// For now this SW exists only so browsers don't 404 on /sw.js and PWA
// installability checks pass. It intentionally does not cache or intercept.
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
