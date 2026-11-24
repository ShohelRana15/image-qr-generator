// ==========================================
// QR HUB PWA - SERVICE WORKER
// ==========================================
// Strategy
//  - App shell is pre-cached on install.
//  - Pages (navigation): network first, fall back to cache when offline.
//  - Own static files: serve from cache instantly, refresh in background.
//  - Pinned CDN libraries (cdnjs / jsDelivr): cache first, so the app also
//    works offline after the first visit.
//  - Supabase, uploads and every non-GET request always go to the network.
// Bump APP_VERSION on every release so old caches are removed.
// ==========================================

const APP_VERSION = "5.7";

const CORE_CACHE = `qrhub-core-v${APP_VERSION}`;
const CDN_CACHE = "qrhub-cdn-v1";

const APP_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png",
    "./qr-sample.png",
    "./welcome-photo.webp"
];

const CDN_HOSTS = [
    "cdnjs.cloudflare.com",
    "cdn.jsdelivr.net"
];


// ==========================================
// INSTALL
// ==========================================

self.addEventListener("install", (event) => {

    self.skipWaiting();

    event.waitUntil(
        caches.open(CORE_CACHE).then((cache) => cache.addAll(APP_FILES))
    );
});


// ==========================================
// ACTIVATE
// ==========================================

self.addEventListener("activate", (event) => {

    event.waitUntil((async () => {

        const names = await caches.keys();

        await Promise.all(
            names
                .filter((name) =>
                    name.startsWith("qrhub-") &&
                    name !== CORE_CACHE &&
                    name !== CDN_CACHE
                )
                .map((name) => caches.delete(name))
        );

        await self.clients.claim();

    })());
});


// ==========================================
// FETCH
// ==========================================

self.addEventListener("fetch", (event) => {

    const request = event.request;

    if (request.method !== "GET") return;

    const url = new URL(request.url);

    // Pages
    if (request.mode === "navigate") {
        event.respondWith(networkFirstPage(request));
        return;
    }

    // Own files
    if (url.origin === self.location.origin) {
        event.respondWith(staleWhileRevalidate(request));
        return;
    }

    // Pinned CDN libraries
    if (CDN_HOSTS.includes(url.hostname)) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Everything else (Supabase API, images in storage...) -> network only
});


async function networkFirstPage(request) {

    try {

        const response = await fetch(request, { cache: "no-cache" });

        if (response && response.ok) {
            const cache = await caches.open(CORE_CACHE);
            cache.put(request, response.clone());
        }

        return response;

    } catch (error) {

        const cached =
            (await caches.match(request)) ||
            (await caches.match("./index.html")) ||
            (await caches.match("./"));

        if (cached) return cached;

        return new Response(
            "QR Hub is offline. Please check your internet connection.",
            {
                status: 503,
                headers: { "Content-Type": "text/plain; charset=utf-8" }
            }
        );
    }
}


async function staleWhileRevalidate(request) {

    const cache = await caches.open(CORE_CACHE);
    const cached = await cache.match(request);

    const network = fetch(request, { cache: "no-cache" })
        .then((response) => {
            if (response && response.ok) {
                cache.put(request, response.clone());
            }
            return response;
        })
        .catch(() => null);

    if (cached) {
        return cached;
    }

    const response = await network;

    return response || Response.error();
}


async function cacheFirst(request) {

    const cache = await caches.open(CDN_CACHE);
    const cached = await cache.match(request);

    if (cached) return cached;

    try {

        const response = await fetch(request);

        // Cross-origin <script>/<link> requests come back "opaque"
        if (response && (response.ok || response.type === "opaque")) {
            cache.put(request, response.clone());
        }

        return response;

    } catch (error) {

        return Response.error();
    }
}


// ==========================================
// MESSAGES
// ==========================================

self.addEventListener("message", (event) => {

    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});
