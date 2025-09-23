const CACHE_NAME = 'gym-member-hub-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Note: We don't cache the dynamically imported TSX or third-party scripts as the browser handles them.
  // The service worker ensures the main entry points are available offline.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // We only want to handle navigation requests for offline support.
  // Other assets like images, scripts, etc., are best handled by the browser's default cache.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Cache hit - return response
          if (response) {
            return response;
          }

          return fetch(event.request)
            .then(response => {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                  return response;
                }

                // IMPORTANT: Clone the response. A response is a stream
                // and because we want the browser to consume the response
                // as well as the cache consuming the response, we need
                // to clone it so we have two streams.
                const responseToCache = response.clone();

                caches.open(CACHE_NAME)
                  .then(cache => {
                    cache.put(event.request, responseToCache);
                  });

                return response;
              }
            ).catch(() => {
                // If the network fails, and we don't have a cached response,
                // serve the offline fallback page.
                return caches.match('/');
            });
        })
    );
  }
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
