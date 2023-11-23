// In service-worker.js

const cacheName = 'mijn-site-cache-v1';
const apiUrl = 'https://api.github.com/repos/TCevik/TCevik.github.io/contents/';
const offlinePage = '/404.html';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([offlinePage]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      }).catch(function() {
        return caches.match(offlinePage);
      })
    );
  } else if (requestUrl.origin === 'https://api.github.com') {
    // Haal bestanden van de GitHub API op en sla ze op in de cache
    event.respondWith(
      fetch(event.request).then(function(response) {
        const clonedResponse = response.clone();
        caches.open(cacheName).then(function(cache) {
          cache.put(event.request, clonedResponse);
        });
        return response;
      }).catch(function() {
        return caches.match(offlinePage);
      })
    );
  }
});
