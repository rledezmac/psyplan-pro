// apps/web/public/sw.js (Generado por workbox)
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

precacheAndRoute(self.__WB_MANIFEST);

// Estrategias de caché
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 })]
  })
);

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/plans') || url.pathname.startsWith('/api/images'),
  new NetworkFirst({ cacheName: 'api-cache' })
);

// Background Sync para formularios offline
self.addEventListener('sync', event => {
  if (event.tag === 'sync-plans') {
    event.waitUntil(syncPendingPlans());
  }
});