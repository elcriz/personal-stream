window.onload = () => {
  if (Notification.permission === 'default') {
    Notification.requestPermission()
      .then(() => {
        if (Notification.permission === 'granted') {
          regWorker().catch((error) => console.error(error));
          return;
        }
      });
      return;
  }

  if (Notification.permission === 'granted') {
    regWorker().catch((error) => console.error(error));
  }
}

async function regWorker() {
  const publicKey = 'BHPOSgUf1aV4JD5EzuNYXtHd4GtpHqYSIomXULncx3FGcVmra0Q5Y8WIHjFi_nJQ0F8njEyFOeBSWSp7UE0oQFs';

  navigator.serviceWorker.register('scripts/service-worker.js', { scope: '/ '});
  navigator.serviceWorker.ready.then(({ pushManager }) => {
    pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicKey,
    }).catch((error) => {
      console.error(error);
    })
  })
}
