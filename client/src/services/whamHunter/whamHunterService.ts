export type IPlayer = {
  _id: string;
  name: string;
  score: number;
};

export default {
  retrievePlayers: async (): Promise<IPlayer[]> => {
    const response = await fetch('/api/whamhunter');
    if (!response.ok) {
      throw response.status;
    }
    const { items } = await response.json();
    return items;
  },

  addPlayer: async (name: string): Promise<IPlayer> => {
    const response = await fetch(`/api/whamhunter/player`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      throw response.status;
    }
    const item = await response.json();
    return item;
  },

  addScore: async (id: string): Promise<IPlayer> => {
    const response = await fetch(`/api/whamhunter/score/${id}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw response.status;
    }
    const item = await response.json();
    return item;
  },

  subscribeUser: (userId: string) => {
    console.log('About to check for permissions:', { userId }, Notification.permission);
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(async (permission) => {
        console.log('subscribing next', { permission });
        subscribeByUserId(userId);
      }).catch((error) => {
        console.log('Error after requesting:', error);
      });
      console.log('Huh');
    } else if (Notification.permission === 'granted') {
      subscribeByUserId(userId);
    } else {
      console.log('Permission to receive notifications:', Notification.permission);
    }
  },
};

async function subscribeByUserId(userId: string) {
  try {
    const publicKey = 'BHPOSgUf1aV4JD5EzuNYXtHd4GtpHqYSIomXULncx3FGcVmra0Q5Y8WIHjFi_nJQ0F8njEyFOeBSWSp7UE0oQFs';

    const registrationBefore = await navigator.serviceWorker.register(`service-worker.js?v=${Date.now()}`, { scope: '/ '});

    if (registrationBefore) {
      navigator.serviceWorker.ready.then(async (registration) => {
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: publicKey,
        });

        const response = await fetch('/api/notifications/subscribe', {
          method: 'POST',
          body: JSON.stringify({ subscription, userId }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          alert(response.status);
          throw response.status;
        }
      });
    }
  } catch (error){
    alert(error);
  }
}
