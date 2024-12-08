self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.clients.claim();
});

self.addEventListener('push', (event) => {
  const { title, body } = event.data.json();

  self.registration.showNotification(title, { body });
});
