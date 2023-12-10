export default {
  retrievePlayers: async () => {
    try {
      const response = await fetch('/api/whamhunter');
      if (!response.ok) {
        throw new Error(response.status);
      }
      const { items } = await response.json();
      return items;
    } catch (error) {
      throw error;
    }
  },

  addPlayer: async (name) => {
    try {
      const response = await fetch(
        `/api/whamhunter/player`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        },
      );
      if (!response.ok) {
        throw new Error(response.status);
      }
      const item = await response.json();
      return item;
    } catch (error) {
      throw error;
    }
  },

  addScore: async (id) => {
    try {
      const response = await fetch(
        `/api/whamhunter/score/${id}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        },
      );
      if (!response.ok) {
        throw new Error(response.status);
      }
      const item = await response.json();
      return item;
    } catch (error) {
      throw error;
    }
  }
}
