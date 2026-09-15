// ==========================================
// QR HUB PWA - AUTOMATIC UPDATE SYSTEM
// ==========================================

const CACHE_NAME = "qrhub-core-v2";

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

    if (event.request.method !== "GET") {
        return;
    }

    if (
        new URL(event.request.url).origin !==
        self.location.origin
    ) {
        return;
    }

    event.respondWith(

        fetch(event.request, {
            cache: "no-store"
        })

        .then((response) => {

            if (response && response.ok) {

                const responseClone =
                    response.clone();

                caches.open(CACHE_NAME).then((cache) => {

                    cache.put(
                        event.request,
                        responseClone
                    );

                });

            }

            return response;

        })

        .catch(() => {

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


if ("serviceWorker" in navigator) {

    window.addEventListener("load", function () {

        navigator.serviceWorker.register("./sw.js")
            .then(function (registration) {

                registration.update();

                registration.addEventListener(
                    "updatefound",
                    function () {

                        const newWorker =
                            registration.installing;

                        if (!newWorker) return;

                        newWorker.addEventListener(
                            "statechange",
                            function () {

                                if (
                                    newWorker.state ===
                                    "installed"
                                ) {

                                    if (
                                        navigator.serviceWorker
                                            .controller
                                    ) {

                                        window.location.reload();

                                    }

                                }

                            }
                        );

                    }
                );

            })
            .catch(function (error) {

                console.error(
                    "Service Worker registration failed:",
                    error
                );

            });

    });

}                  
