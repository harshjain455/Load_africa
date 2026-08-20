import { locationService } from '../locationService';

export const GeocodeService = {
  /**
   * Geocodes an address to latitude and longitude
   * @param {string} address 
   * @returns {Promise<{lat: number, lng: number, displayName: string}>}
   */
  geocode: async (address) => {
    if (!address) throw new Error('Address is required');

    try {
      const results = await locationService.searchLocations(address);
      if (results && results.length > 0) {
        const first = results[0];
        return {
          lat: first.latitude || first.lat,
          lng: first.longitude || first.lng,
          displayName: first.formattedAddress || first.label,
        };
      }
      throw new Error('Address not found');
    } catch (error) {
      console.error('Geocoding Error:', error);
      throw error;
    }
  },

  /**
   * Reverse geocodes latitude and longitude to an address
   * @param {number} lat 
   * @param {number} lng 
   * @returns {Promise<string>}
   */
  reverseGeocode: async (lat, lng) => {
    if (lat === undefined || lng === undefined) throw new Error('Coordinates are required');

    try {
      const location = await locationService.reverseGeocode(lat, lng);
      if (location && location.formattedAddress) {
        return location.formattedAddress;
      }
      return `${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`;
    } catch (error) {
      console.error('Reverse Geocoding Error:', error);
      return `${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`;
    }
  }
};
