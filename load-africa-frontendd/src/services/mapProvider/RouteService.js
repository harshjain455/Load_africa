import { locationService } from '../locationService';

export const RouteService = {
  /**
   * Calculates route path, distance, and duration between two points
   * @param {number} startLat 
   * @param {number} startLng 
   * @param {number} endLat 
   * @param {number} endLng 
   * @returns {Promise<{distanceKm: number, durationMinutes: number, polylineCoordinates: Array<[number, number]>}>}
   */
  getRoute: async (startLat, startLng, endLat, endLng) => {
    if (startLat === undefined || startLng === undefined || endLat === undefined || endLng === undefined) {
      throw new Error('Start and end coordinates are required');
    }

    try {
      const routeData = await locationService.getRoute(startLat, startLng, endLat, endLng);
      if (routeData) {
        return {
          distanceKm: routeData.distanceKm,
          durationMinutes: routeData.durationMins,
          polylineCoordinates: routeData.polylineCoordinates || []
        };
      }
      throw new Error('No route found');
    } catch (error) {
      console.error('Routing Error:', error);
      const distKm = parseFloat(RouteService.calculateHaversineDistance(startLat, startLng, endLat, endLng).toFixed(2));
      return {
        distanceKm: distKm,
        durationMinutes: Math.round((distKm / 60) * 60),
        polylineCoordinates: [
          [startLat, startLng],
          [endLat, endLng]
        ]
      };
    }
  },

  /**
   * Helper to calculate straight-line (Haversine) distance in km
   */
  calculateHaversineDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
};
