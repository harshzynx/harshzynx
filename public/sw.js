// HARSHZYNX Service Worker
// Automatically flushes stale caches on update and ensures network-first live responses

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => self.clients.claim())
  );
});

// For all requests, fetch directly from network so published and live changes are never stale
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Bypass API and Admin calls
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/admin')) {
    return;
  }

  // Network fetch with offline fallback
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
