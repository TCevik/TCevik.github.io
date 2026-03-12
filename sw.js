self.addEventListener('fetch', (event) => {
    // Deze lege fetch-handler is het minimum dat nodig is voor installatie
    event.respondWith(fetch(event.request));
  });