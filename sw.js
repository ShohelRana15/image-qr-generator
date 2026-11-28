const CACHE = "qrhub-v11";
const FILES = ["./", "./index.html", "./style.css", "./script.js", "./images.js", "./manifest.json", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); });
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => clients.claim())));
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  // CDN libs (QR engine / scanner): cache-first so the app works offline
  const cdn = u.hostname === "cdnjs.cloudflare.com";
  if (u.origin !== location.origin && !cdn) return;
  e.respondWith(cdn
    ? caches.match(e.request).then(r => r || fetch(e.request).then(res => { const cl = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cl)); return res; }))
    : fetch(e.request).then(res => { if (res.ok) { const cl = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cl)); } return res; }).catch(() => caches.match(e.request)));
});
