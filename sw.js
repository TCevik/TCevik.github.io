const CACHE_NAME = 'quizy-v1';
const ASSETS = [
  '/quizy/home.html',
  '/quizy/index.html',
  '/quizy/set.html',
  '/quizy/style.css',
  '/quizy/js/quizy-utils.js',
  '/quizy/js/theme-init.js',
  '/quizy/js/auth-check.js',
  '/script.js',
  '/tctam-logo.png',
  '/app.webmanifest'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(err => console.log('Asset caching error:', err));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch new one in background to update cache (stale-while-revalidate)
        fetch(e.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, networkResponse);
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(e.request);
    }).catch(() => {
      if (e.request.mode === 'navigate') {
        return caches.match('/quizy/home.html');
      }
    })
  );
});
