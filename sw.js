const CACHE_NAME = 'bussiajad-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './favicon.svg',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

// Paigaldus: salvesta staatilised failid vahemällu
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Aktiveerimine: puhasta vanad vahemälud
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Päringute haldus (Fetch)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Tallinna transpordi reaalaja andmevoog: tee alati otsepäring võrku (Network Only / Network First)
  if (url.hostname.includes('transport.tallinn.ee')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response('', {
          status: 503,
          statusText: 'Reaalaja andmed pole hetkel kättesaadavad (offline)'
        });
      })
    );
    return;
  }

  // 2. Kolmandate osapoolte CDN-id (Tailwind, Google Fonts): Stale-While-Revalidate
  if (url.hostname.includes('cdn.tailwindcss.com') ||
      url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. Kohalikud staatilised failid: Stale-While-Revalidate / Cache First
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
