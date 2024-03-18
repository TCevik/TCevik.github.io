const CACHE_NAME = 'offline-cache';
const OFFLINE_PAGE = '/offline.html';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([OFFLINE_PAGE]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return fetch(event.request).then(response => {
        // Update the offline page if fetch is successful
        if (event.request.url.includes(OFFLINE_PAGE)) {
          cache.put(event.request, response.clone());
        }
        return response;
      }).catch(() => {
        return caches.match(event.request).then(cachedResponse => {
          return cachedResponse || caches.match(OFFLINE_PAGE);
        });
      });
    })
  );
});

self.addEventListener('online', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.delete(OFFLINE_PAGE);
    }).then(() => {
      return fetch(OFFLINE_PAGE).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          return cache.put(OFFLINE_PAGE, response);
        });
      });
    })
  );
});