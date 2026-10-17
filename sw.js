const CACHE_NAME = 'bussiajad-v21';
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
  // Toeta ainult GET päringuid
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. Tallinna transpordi reaalaja andmevoog: tee alati otsepäring võrku (Network Only)
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

  // 2. Navigatsioonipäringud (HTML lehe avamine, sh ?filter=8, ?filter=8A, ?filter=48 PWA otseteed): Network-First koos vahemälu tagavaraga
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', responseClone)).catch(() => {});
        }
        return networkResponse;
      }).catch(async () => {
        const cached = await caches.match('./index.html');
        return cached || new Response('', { status: 504, statusText: 'Offline' });
      })
    );
    return;
  }

  // 3. Kolmandate osapoolte CDN-id (Tailwind, Google Fonts): Stale-While-Revalidate koos opaque toega
  if (url.hostname.includes('cdn.tailwindcss.com') ||
      url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse || new Response('', { status: 504, statusText: 'Offline' }));

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 4. Kohalikud staatilised failid: Stale-While-Revalidate / Cache First ({ ignoreSearch: true })
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          }).catch(() => {});
        }
        return networkResponse;
      }).catch(() => cachedResponse || new Response('', { status: 504, statusText: 'Offline' }));

      return cachedResponse || fetchPromise;
    })
  );
});
