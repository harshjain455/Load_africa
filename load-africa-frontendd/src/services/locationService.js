import api from './api';

/**
 * Frontend Location Service
 * Communicates with backend endpoints for search, reverse-geocode, and routing.
 */
export const locationService = {
  /**
   * Search for locations with debounce and cancellation support
   * @param {string} query
   * @param {AbortSignal} [signal]
   * @returns {Promise<Array>}
   */
  searchLocations: async (query, signal) => {
    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return [];
    }

    try {
      const response = await api.get('/locations/search', {
        params: { q: query.trim(), limit: 6 },
        signal,
      });

      return response.data?.data || [];
    } catch (error) {
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        // Ignored, request was cancelled
        return [];
      }
      console.error('Location search API error:', error);
      return [];
    }
  },

  /**
   * Reverse geocodes coordinates to a readable address
   * @param {number} lat
   * @param {number} lng
   * @returns {Promise<Object>}
   */
  reverseGeocode: async (lat, lng) => {
    try {
      const response = await api.get('/locations/reverse-geocode', {
        params: { lat, lng },
      });
      return response.data?.data || null;
    } catch (error) {
      console.error('Reverse geocode API error:', error);
      return {
        formattedAddress: `Location (${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)})`,
        latitude: lat,
        longitude: lng,
      };
    }
  },

  /**
   * Calculates route between two coordinates
   * @param {number} originLat
   * @param {number} originLng
   * @param {number} destinationLat
   * @param {number} destinationLng
   * @param {AbortSignal} [signal]
   * @returns {Promise<Object>}
   */
  getRoute: async (originLat, originLng, destinationLat, destinationLng, signal) => {
    try {
      const response = await api.get('/locations/route', {
        params: {
          originLat,
          originLng,
          destinationLat,
          destinationLng,
        },
        signal,
      });

      return response.data?.data || null;
    } catch (error) {
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        return null;
      }
      console.error('Route calculation API error:', error);
      return null;
    }
  },
};

export default locationService;
