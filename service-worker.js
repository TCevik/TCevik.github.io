const CACHE_NAME = 'tctam-site-cache';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      // Voeg de bestanden toe aan de cache
      return cache.addAll([
        '/index.html',
        '/style.css',
        '/script.js',
        '/manifest.json',
        '/offline.html',
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Voeg een extra controle toe om te zien of de gebruiker wifi heeft
    self.clients.matchAll().then(clients => {
      const isWifi = clients.some(client => client.type === 'wifi');
      
      // Alleen bijwerken van cache als de gebruiker wifi heeft
      if (isWifi) {
        return fetchAndUpdateCache(event.request);
      } else {
        return caches.match(event.request).then(function(response) {
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
        });
      }
    })
  );
});

function fetchAndUpdateCache(request) {
  return fetch(request).then(function(response) {
    // Als de bron is opgehaald, sla deze op in de cache
    return caches.open(CACHE_NAME).then(function(cache) {
      cache.put(request, response.clone());
      return response;
    });
  }).catch(function() {
    // Als het ophalen mislukt, toon offline.html
    return caches.match('/offline.html');
  });
}
