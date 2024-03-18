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
      return cache.match(event.request).then(response => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (event.request.method !== 'GET' || !networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        }).catch(() => {
          return caches.match(OFFLINE_PAGE);
        });

        return response || fetchPromise;
      });
    })
  );
});
