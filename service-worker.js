// In service-worker.js

const cacheName = 'mijn-site-cache-v3';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      // Geen initiële caching nodig bij installatie
      return;
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(cacheName).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        return response || fetch(event.request).then(function(response) {
          // Cache de nieuwe bestanden die worden gedownload
          cache.put(event.request, response.clone());
          return response;
        });
      });
    }).catch(function() {
      return caches.match('/offline.html');
    })
  );
});