const CACHE_NAME = 'my-site-cache-v1';
const OFFLINE_PAGE = '/offline.html';
const GITHUB_API_URL = 'https://api.github.com/repos/TCevik/TCevik.github.io/contents';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Haal de bestanden op van de GitHub-repository en sla ze op in de cache
      return fetch(GITHUB_API_URL)
        .then(response => response.json())
        .then(files => {
          return Promise.all(files.map(file => {
            const url = file.type === 'file' ? file.download_url : `${GITHUB_API_URL}/${file.name}`;
            return fetch(url).then(response => {
              return cache.put(url, response);
            });
          }));
        });
    })
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
