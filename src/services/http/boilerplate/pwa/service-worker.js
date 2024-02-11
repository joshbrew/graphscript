
//https://github.com/ibrahima92/pwa-with-vanilla-js
const version = '1.0'; // Increment this version to update all caches
const cacheNamePrefix = 'pwa-assets-';
const cacheName = `${cacheNamePrefix}${version}`;
const assets = [
  "/",
  "/index.html",
  "/dist/index.css", //alt default paths
  "/dist/index.js",
  '/favicon.ico'
];

let cacheExpiration = 1000 * 60 * //seconds 
  60 * //minutes
  24 * //hours
  (4/24);    //days (4 hours in this case)

// Function to check if a cache name represents an expired cache
let isValidCacheName = function(cacheName) {
  const cacheTimestamp = parseInt(cacheName.split('-').pop());
  const currentTime = new Date().getTime();
  return currentTime < cacheTimestamp + cacheExpiration;
};

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {

      // Check if online; if not, return cached response immediately
      if (!navigator.onLine) {
        return cachedResponse;
      }

      // Serve from cache if valid, otherwise fetch from network
      return caches.keys().then(cacheNames => {
        const relevantCacheName = cacheNames.find(name => name.startsWith(cacheNamePrefix));
        if (relevantCacheName && isValidCacheName(relevantCacheName)) {
          return cachedResponse || fetchAndUpdateCache(event.request, relevantCacheName);
        } else {
          return fetchAndUpdateCache(event.request, cacheName);
        }
      });
    })
  );
});

function fetchAndUpdateCache(request, cacheName) {
  return fetch(request).then(response => {
    // Only cache GET requests to whitelisted assets
    if (request.method === 'GET' && assets.includes(new URL(request.url).pathname)) {
      const responseToCache = response.clone();
      caches.open(cacheName).then(cache => {
        cache.put(request, responseToCache);
      });
    }
    return response;
  }).catch(() => {
    // Attempt to serve from cache if the network request fails
    return caches.match(request);
  });
}

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name.startsWith(cacheNamePrefix) && !isValidCacheName(name))
          .map(invalidCacheName => caches.delete(invalidCacheName))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(assets))
      .then(() => self.skipWaiting())
  );
});
