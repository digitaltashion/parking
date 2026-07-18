importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

const SW_VERSION = '1.0.1'; // Update this string to force SW re-installation

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
  // Using NetworkFirst so users always get the latest uploaded code from GitHub when online.
  // Falls back to cache instantly if they are offline.
  workbox.routing.registerRoute(
    ({url}) => url.origin === self.location.origin,
    new workbox.strategies.NetworkFirst({
      cacheName: 'parking-stand-local',
      networkTimeoutSeconds: 3,
    })
  );

} else {
  console.log('Workbox failed to load');
}
