importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  // Force activate the new service worker immediately
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // Cache CDN libraries (Scripts, Styles)
  workbox.routing.registerRoute(
    ({url}) => url.origin === 'https://cdn.jsdelivr.net' || url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
    new workbox.strategies.CacheFirst({
      cacheName: 'parking-stand-cdns',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  // Cache same-origin assets (e.g. index.html)
  workbox.routing.registerRoute(
    ({url}) => url.origin === self.location.origin,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'parking-stand-local',
    })
  );

} else {
  console.log('Workbox failed to load');
}
