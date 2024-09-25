import { GeoItem } from '../types';

const gameService = {
  europe: {
    getCountries: async (): Promise<GeoItem[]> => {
      try {
        const response = await fetch('geolufi/data/europe/countries.json');
        if (!response.ok) {
          throw response.status;
        }
        return response.json();
      } catch(error) {
        throw error;
      }
    },
  },
};

export default gameService;
