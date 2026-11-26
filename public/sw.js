// Service Worker para suporte PWA no Chrome / Edge Desktop
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass-through padrão para navegação e assets
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
