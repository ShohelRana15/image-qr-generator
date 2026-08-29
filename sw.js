// ==========================================
// QR HUB PWA - AUTOMATIC UPDATE SYSTEM
// ==========================================

const CACHE_NAME = "qrhub-core-v1";

const APP_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png",
    "./qr-sample.png",
    "./welcome-photo.png"
];


// ==========================================
// INSTALL
// ==========================================

self.addEventListener("install", (event) => {

    // নতুন Service Worker অপেক্ষা করবে না
    self.skipWaiting();

    event.waitUntil(

        caches.open(CACHE_NAME).then((cache) => {

            return cache.addAll(APP_FILES);

        })

    );

});


// ==========================================
// ACTIVATE
// ==========================================

self.addEventListener("activate", (event) => {

    event.waitUntil(

        (async () => {

            const cacheNames = await caches.keys();

            // পুরোনো QR Hub cache delete
            await Promise.all(

                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))

            );

            // নতুন Service Worker সব tab-এর control নেবে
            await self.clients.claim();

        })()

    );

});


// ==========================================
// FETCH
// ==========================================

self.addEventListener("fetch", (event) => {

    // শুধু GET request
    if (event.request.method !== "GET") {
        return;
    }


    // শুধুমাত্র একই origin-এর request
    if (new URL(event.request.url).origin !== self.location.origin) {
        return;
    }


    event.respondWith(

        fetch(event.request)

            .then((response) => {

                // সফল response হলে cache update
                if (response && response.ok) {

                    const responseClone = response.clone();

                    caches.open(CACHE_NAME).then((cache) => {

                        cache.put(event.request, responseClone);

                    });

                }

                return response;

            })

            .catch(() => {

                // Internet না থাকলে cache থেকে load
                return caches.match(event.request);

            })

    );

});


// ==========================================
// SKIP WAITING MESSAGE
// ==========================================

self.addEventListener("message", (event) => {

    if (
        event.data &&
        event.data.type === "SKIP_WAITING"
    ) {

        self.skipWaiting();

    }

});
