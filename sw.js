const cacheName = 'restaurant-app-project-v9';
const urlsToCache = [
  '/',
  './index.html',
  './restaurant.html',
  './css/styles.css',
  './js/dbhelper.js',
  './js/main.js',
  './js/restaurant_info.js',
  './js/serviceWorkerRegistration.js',
  './img/1.jpg',
  './img/2.jpg',
  './img/3.jpg',
  './img/4.jpg',
  './img/5.jpg',
  './img/6.jpg',
  './img/7.jpg',
  './img/8.jpg',
  './img/9.jpg',
  './img/10.jpg',
  './data/restaurants.json'
];

self.addEventListener('install', function(event) {
  console.log("[ServiceWorker] Installed")
  event.waitUntil(
      caches.open(cacheName)
      .then(function(cache) {
        console.log('adding caches to ' + cacheName);
        return cache.addAll(urlsToCache);
      }).catch(function(err) {
        console.log(err);
      })
    );
});

self.addEventListener('activate', function(event) {
  console.log("[ServiceWorker] Activated")

  event.waitUntil(caches.keys().then(function(cacheNames){
    return Promise.all(cacheNames.map(function(thisCacheName){
      if (thisCacheName !== cacheName) {
        console.log("Removing cache from", thisCacheName)
        return caches.delete(thisCacheName);
      }
    }))
  }))
  event.waitUntil(self.clients.claim());
});


self.addEventListener('fetch', function(event) {
  console.log("[ServiceWorker] Fetching", event.request.url)

  event.respondWith(

    caches.match(event.request)
      .then(function(response) {
        if (response) {
          console.log("[ServiceWorker] found in cache", event.request.url, response);
          return response;
      }

      var requestClone = event.request.clone();
      return fetch(requestClone)
      .then(function(response) {
        if (!response) {
          console.log("[ServiceWorker] no response from fetch");
          return response;
        }

        var responseClone = response.clone();

        caches.open(cacheName).then(function(cache){
          cache.put(event.request, responseClone);
          console.log('[ServiceWorker] New Data Cached', event.request.url);
          return response;
        });
      })

      .catch(function(err) {
        console.log("[ServiceWorker] error fetching and caching", err);
      });
    })
  );
});

/*credits https://github.com/ireade/boilerplate-service-worker/blob/gh-pages/src/service-worker.js */
