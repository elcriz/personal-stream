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
};
