const CACHE_NAME = 'rmmz-offline-cache-v1';

// Intercept fetch requests to serve from cache or network
self.addEventListener('fetch', (event) => {
  // Only handle standard http/https requests (skip chrome-extension, etc.)
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version immediately if available
      if (cachedResponse) {
        // Fetch a fresh version in the background to update cache for next time
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => {/* Ignore background fetch failures when offline */});
          
        return cachedResponse;
      }

      // If not in cache, fetch from network and cache it dynamically
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // Fallback if network fails and item isn't cached (e.g. offline new map)
          console.error('Asset not cached and user is offline:', event.request.url);
        });
    })
  );
});

// Clean up old caches when upgrading versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
