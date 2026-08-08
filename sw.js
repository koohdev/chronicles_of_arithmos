// Minimal pass-through Service Worker required for PWA Add to Home Screen eligibility.
// Zero offline caching: 100% of requests pass directly to the live network.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});
