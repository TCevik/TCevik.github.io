const CACHE_NAME = 'tctam-site-cache';

self.addEventListener('install', function(event) {
  event.waitUntil(
    // Verwijder de oude cache en maak een nieuwe cache aan
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    }).then(function() {
      return caches.open(CACHE_NAME).then(function(cache) {
        // Voeg de bestanden toe aan de nieuwe cache
        return cache.addAll([
          '/index.html',
          '/style.css',
          '/script.js',
          '/manifest.json',
          '/offline.html',
        ]);
      });
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Controleer of de gevraagde bron in de cache beschikbaar is
      return response || fetch(event.request).then(function(response) {
        // Als de bron niet in de cache is, sla deze op in de cache
        return caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch(function() {
        // Als het ophalen mislukt en er geen cache is, toon offline.html
        return caches.match('/offline.html');
      });
    })
  );
});
