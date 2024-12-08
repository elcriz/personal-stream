self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

self.addEventListener('push', (event) => {
  const { title, body } = event.data.json();

  console.debug('Push received', { title, body });

  // event.waitUntil(
  console.log('self.registration -->', self.registration);
  self.registration.showNotification(title, { body });
  // );
});
