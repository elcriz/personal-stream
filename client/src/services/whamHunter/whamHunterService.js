export default {
  retrievePlayers: async () => {
    const response = await fetch('/api/whamhunter');
    if (!response.ok) {
      throw new Error(response.status);
    }
    const { items } = await response.json();
    return items;
  },

  addPlayer: async (name) => {
    const response = await fetch(`/api/whamhunter/player`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      throw new Error(response.status);
    }
    const item = await response.json();
    return item;
  },

  addScore: async (id) => {
    const response = await fetch(`/api/whamhunter/score/${id}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(response.status);
    }
    const item = await response.json();
    return item;
  },
};
