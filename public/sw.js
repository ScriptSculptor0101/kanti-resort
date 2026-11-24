// Service Worker for Kanti Resort Staff App PWA / WebAPK Installation
const CACHE_NAME = 'kanti-staff-app-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/?mode=app',
  '/?mode=app#app',
  '/#app',
  '/index.html',
  '/manifest.json',
  '/kanti-logo-circle.png',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request).then(cached => cached || caches.match('/')))
  );
});
