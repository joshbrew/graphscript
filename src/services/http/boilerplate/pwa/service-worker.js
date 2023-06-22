
//https://github.com/ibrahima92/pwa-with-vanilla-js
let cacheName = 'pwa-assets';
const assets = [
  "/",
  "/index.html",
  "/styles.css",
  "/index.css",
  "/index.js",
  "/dist/index.css", //alt default paths
  "/dist/index.js",
  '/favicon.ico',
  '/service-worker.js'
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(cacheName).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});