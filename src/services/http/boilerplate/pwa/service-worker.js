
//https://github.com/ibrahima92/pwa-with-vanilla-js
let cacheName = 'pwa-assets';
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

let isValid = function (response) {
	if (!response) return false;
	var fetched = response.headers.get('sw-fetched-on');
	if (fetched && (!navigator.onLine || (parseFloat(fetched) + (cacheExpiration)) > new Date().getTime()))
    return true;
	return false;
};

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(cacheName).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", fetchEvent => { //https://gomakethings.com/how-to-set-an-expiration-date-for-items-in-a-service-worker-cache/
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(function (response) {

			// If there's a cached API and it's still valid, use it
			if (isValid(response)) {
				return response;
			}

			// Otherwise, make a fresh API call
			return fetch(fetchEvent.request).then(function (response) {

				// Cache for offline access
				var copy = response.clone();
				fetchEvent.waitUntil(caches.open(cacheName).then(function (cache) {
					var headers = new Headers(copy.headers);
					headers.append('sw-fetched-on', new Date().getTime());
					return copy.blob().then(function (body) {
						return cache.put(fetchEvent.request, new Response(body, {
							status: copy.status,
							statusText: copy.statusText,
							headers: headers
						}));
					});
				}));

				// Return the requested file
				return response;

			})
      // .catch(function (error) {
			// 	return caches.match(request).then(function (response) { //fallback to offline cache
			// 		return response || caches.match('/offline.json'); //todo: figure out what is supposed to go in offline.json (https://gomakethings.com/how-to-set-an-expiration-date-for-items-in-a-service-worker-cache/)
			// 	});
			// });  
  }));
});




