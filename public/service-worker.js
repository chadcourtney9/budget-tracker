const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/index.js',
    '/db.js',
    '/styles.css',
    'https://fonts.googleapis.com/css?family=Istok+Web%7CMontserrat:800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css',
    "icons/icon-192x192.png"
];

const CACHE_NAME = 'static-cache-v1';
const DATA_CACHE_NAME = 'data-cache-v1';

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    // remove old caches
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    if (event.request.url.includes("/api/") && event.request.method === "GET") {
        event.respondWith(
            caches
                .open(DATA_CACHE_NAME)
                .then((cache) => {
                    return fetch(event.request)
                        .then((response) => {
                            if (response.status === 200) {
                                cache.put(event.request, response.clone());
                            }
                            return response;
                        })
                        .catch(() => {
                            return cache.match(event.request);
                        });
                })
                .catch((err) => console.log(err))
        );
        return;
    }
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

console.log("hello from service worker")