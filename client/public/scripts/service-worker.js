self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

self.addEventListener('push', (event) => {
  const { title, body } = event.data.json();

  event.waitUntil(
    self.registration.showNotification(title, { body }),
  );
});
