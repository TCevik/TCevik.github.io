const CACHE_NAME = 'my-site-cache-v1';
const OFFLINE_PAGE = '/offline.html';
const GITHUB_REPO_API = 'https://api.github.com/repos/TCevik/TCevik.github.io/contents';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return fetch(GITHUB_REPO_API)
        .then(response => response.json())
        .then(files => {
          const fileUrls = files.map(file => file.download_url);
          return cache.addAll([OFFLINE_PAGE, ...fileUrls]);
        })
        .catch(error => console.error('Fout bij ophalen bestanden:', error));
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => {
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
          if (networkResponse) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          return caches.match(OFFLINE_PAGE);
        });

        if (navigator.onLine) {
          fetchPromise.then(networkResponse => {
            cache.delete(request);
            cache.put(request, networkResponse.clone());
          });
        }

        return response || fetchPromise;
      });
    })
  );
});