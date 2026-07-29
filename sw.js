const CACHE_NAME = "qrhub-v3";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  // শুধু Network থেকে লোড করবে
});
