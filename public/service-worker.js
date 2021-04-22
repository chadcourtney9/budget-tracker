const FILES_TO_CACHE = [
    '/',
    './index.html',
    './assets/css/style.css',
    './index.js',
    './icons/icon-192x192.png',
    './icons/icon-512x512.png',
    'https://fonts.googleapis.com/css?family=Istok+Web|Montserrat:800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css',
];

const PRECACHE = 'static-cache-v2';
const RUNTIME = 'data-cache-v1';

self.addEventListener("install", function (evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Your files were pre-cached successfully!");
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

// activate
self.addEventListener("activate", function (evt) {
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("Removing old cache data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );

    self.clients.claim();
});

// fetch
self.addEventListener("fetch", function (evt) {
    evt.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(evt.request).then(response => {
                return response || fetch(evt.request);
            });
        })
    );
});