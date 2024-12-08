self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

self.addEventListener('push', (event) => {
  const { title, body } = event.data.json();

  console.debug('Push received', { title, body });

  event.waitUntil(
    self.registration.showNotification(title, { body }),
  );
});
