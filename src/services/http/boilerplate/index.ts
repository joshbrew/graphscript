
export function htmlBodyBoilerPlate(html:string|string[]) {
    let template = `<!DOCTYPE html><html><head><body>`
    if(Array.isArray(html)) {
        html.forEach((src) => {
            template += src;
        })
    } else {
        template += html;
    }
    template += `</body></html>`
    return template;
}

export function scriptBoilerPlate(scripts:string|string[]) {
    let template = `<!DOCTYPE html><html><head><body>`
    if(Array.isArray(scripts)) {
        scripts.forEach((src) => {
            template += `<script src="${src}"></script>`;
        })
    } else {
        template += `<script src="${scripts}"></script>`;
    }
    template += `</body></html>`
    return template;
}



export const defaultServiceWorker = function (cacheExpirationDays=4/24) { //service-worker.js template for PWA
    return `//https://github.com/ibrahima92/pwa-with-vanilla-js

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
  ${cacheExpirationDays};    //days

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
        if(response && !assets.includes(fetchEvent.request.url)) return response;
        // Otherwise, make a fresh API call
        else return fetch(fetchEvent.request).then(function (response) {

            // Cache for offline access
            if(assets.includes(fetchEvent.request.url)){
              var copy = response.clone();
              fetchEvent.waitUntil(caches.open(cacheName).then(function (cache) {
                var headers = new Headers(copy.headers);
                headers.append('sw-fetched-on', new Date().getTime());
                return copy.blob().then(function (body) {
                  return cache.put(fetchEvent.request, new Response(body, {
                    status: copy.status ? copy.status : 200,
                    statusText: copy.statusText,
                    headers: headers
                  }));
                });
              }));
            }
            
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

`;
}

//todo: make this even more customizable, just being lazy for now
export const defaultManifest = (pwaName = "PWA") => {
    return `{
    "short_name": "${pwaName}",
    "name": "${pwaName}",
    "start_url": "/",
    "display": "standalone",
    "theme_color": "#000000",
    "background_color": "#ffffff",
    "description": "${pwaName} Test",
    "lang": "en-US",
    "permissions": [
        "storage"
    ],
    "icons":[{
        "src": "./assets/logo196.png",
        "sizes": "196x196"
    },
    {
        "src": "./assets/logo512.png",
        "sizes": "512x512"
    }]
}` //images are REQUIRED for PWA to work
}

