const locationService = require('../services/locationService');

/**
 * GET /api/v1/locations/search?q=...
 */
const searchLocations = async (req, res, next) => {
  try {
    const { q, limit } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const results = await locationService.searchLocations(
      q,
      limit ? parseInt(limit) : 6
    );

    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Location search controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search locations',
      error: error.message,
    });
  }
};

/**
 * GET /api/v1/locations/reverse-geocode?lat=...&lng=...
 */
const reverseGeocode = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Latitude (lat) and Longitude (lng) are required',
      });
    }

    const location = await locationService.reverseGeocode(lat, lng);

    return res.status(200).json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.error('Reverse geocode controller error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to reverse geocode location',
    });
  }
};

/**
 * GET or POST /api/v1/locations/route?originLat=...&originLng=...&destinationLat=...&destinationLng=...
 */
const getRoute = async (req, res, next) => {
  try {
    const originLat = req.query.originLat || req.body?.originLat;
    const originLng = req.query.originLng || req.body?.originLng;
    const destinationLat = req.query.destinationLat || req.body?.destinationLat;
    const destinationLng = req.query.destinationLng || req.body?.destinationLng;

    if (
      originLat === undefined ||
      originLng === undefined ||
      destinationLat === undefined ||
      destinationLng === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: 'originLat, originLng, destinationLat, and destinationLng are all required.',
      });
    }

    const routeData = await locationService.getRoute(
      originLat,
      originLng,
      destinationLat,
      destinationLng
    );

    return res.status(200).json({
      success: true,
      data: routeData,
    });
  } catch (error) {
    console.error('Route calculation controller error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to calculate route',
    });
  }
};

module.exports = {
  searchLocations,
  reverseGeocode,
  getRoute,
};
