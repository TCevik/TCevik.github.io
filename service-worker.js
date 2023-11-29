const CACHE_NAME = 'my-site-cache-v1';
const OFFLINE_PAGE = '/offline.html';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.add(OFFLINE_PAGE))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => {
          // Verwijder alle oude caches behalve de huidige cache
          return name !== CACHE_NAME;
        }).map(name => {
          return caches.delete(name);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(request).then(response => {
        const fetchPromise = fetch(request).then(networkResponse => {
          // Als er een nieuwe versie is, sla die op in de cache
          if (networkResponse) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Als er geen internetverbinding is, toon de offline pagina
          return caches.match(OFFLINE_PAGE);
        });

        // Als er wifi is, verwijder de oude cache en haal altijd een nieuwe versie op
        if (navigator.onLine) {
          fetchPromise.then(networkResponse => {
            cache.delete(request); // Verwijder oude cache
            cache.put(request, networkResponse.clone()); // Sla nieuwe op
          });
        }

        return response || fetchPromise;
      });
    })
  );
});
