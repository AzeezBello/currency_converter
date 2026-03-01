var STATIC_CACHE = 'currency-converter-static-v2';
var APP_SHELL = [
  '/',
  '/index.html',
  '/vendor/bootstrap/css/bootstrap.min.css',
  '/css/landing-page.css',
  '/img/bg-masthead.jpg',
  '/img/bg-showcase-1.jpg',
  '/img/bg-showcase-2.jpg',
  '/img/bg-showcase-3.jpg',
  '/img/favicon.png',
  '/img/testimonials-1.jpg',
  '/img/testimonials-2.jpg',
  '/img/testimonials-3.jpg',
  '/vendor/jquery/jquery.min.js',
  '/vendor/bootstrap/js/bootstrap.bundle.min.js',
  '/js/currency-converter.js'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(function (cache) {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== STATIC_CACHE) {
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') {
    return;
  }

  var requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      var networkFetch = fetch(event.request)
        .then(function (networkResponse) {
          if (networkResponse && networkResponse.ok) {
            var clone = networkResponse.clone();
            caches.open(STATIC_CACHE).then(function (cache) {
              cache.put(event.request, clone);
            });
          }
          return networkResponse;
        })
        .catch(function () {
          return cachedResponse || Response.error();
        });

      return cachedResponse || networkFetch;
    })
  );
});
