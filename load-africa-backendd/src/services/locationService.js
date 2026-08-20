/**
 * Location Service for Geocoding, Reverse Geocoding, and Routing.
 * Supports OpenStreetMap (Nominatim & OSRM) by default with support for Google Maps.
 */

// Helper to format duration into human-readable string
const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return '0 min';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
};

// Helper to format distance
const formatDistance = (meters) => {
  if (!meters || meters <= 0) return '0 km';
  const km = (meters / 1000).toFixed(1);
  return `${km} km`;
};

// Haversine fallback distance calculation in km
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Searches for locations matching a text query
 * @param {string} query 
 * @param {number} limit 
 */
const searchLocations = async (query, limit = 6) => {
  if (!query || typeof query !== 'string' || query.trim().length < 2) {
    return [];
  }

  const trimmedQuery = query.trim();

  // Try OpenStreetMap Nominatim with primary South Africa focus + global fallback
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      trimmedQuery
    )}&format=json&countrycodes=za,na,bw,zw,mz,ls,sz&limit=${limit}&addressdetails=1`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'LoadAfricaLogisticsApp/1.0 (contact@loadafrica.co.za)',
        'Accept-Language': 'en',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      throw new Error(`Nominatim error: ${res.statusText}`);
    }

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      // Global fallback if region-restricted search yielded 0 results
      const fallbackUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        trimmedQuery
      )}&format=json&limit=${limit}&addressdetails=1`;
      
      const fallbackRes = await fetch(fallbackUrl, {
        headers: {
          'User-Agent': 'LoadAfricaLogisticsApp/1.0 (contact@loadafrica.co.za)',
          'Accept-Language': 'en',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        return normalizeNominatimResults(fallbackData);
      }
      return [];
    }

    return normalizeNominatimResults(data);
  } catch (error) {
    console.error('Location search error:', error.message);
    return [];
  }
};

/**
 * Normalizes raw Nominatim search results into standard client format
 */
const normalizeNominatimResults = (results) => {
  if (!Array.isArray(results)) return [];

  return results.map((item) => {
    const address = item.address || {};
    const city =
      address.city ||
      address.town ||
      address.village ||
      address.suburb ||
      address.county ||
      '';
    const province = address.state || address.province || address.region || '';
    const country = address.country || 'South Africa';

    // Format cleaner label
    let cleanLabel = item.display_name;
    const parts = item.display_name.split(',').map((p) => p.trim());
    if (parts.length > 4) {
      cleanLabel = parts.slice(0, 4).join(', ');
    }

    return {
      placeId: String(item.place_id || item.osm_id || Math.random()),
      formattedAddress: cleanLabel,
      fullAddress: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      city,
      province,
      country,
    };
  });
};

/**
 * Reverse geocodes latitude and longitude into an address
 * @param {number} lat 
 * @param {number} lng 
 */
const reverseGeocode = async (lat, lng) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (
    isNaN(latitude) ||
    isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error('Invalid latitude or longitude coordinates');
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'LoadAfricaLogisticsApp/1.0 (contact@loadafrica.co.za)',
        'Accept-Language': 'en',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      throw new Error(`Reverse geocoding error: ${res.statusText}`);
    }

    const item = await res.json();
    if (!item || !item.display_name) {
      return {
        placeId: `custom-${latitude.toFixed(4)}-${longitude.toFixed(4)}`,
        formattedAddress: `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
        fullAddress: `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
        latitude,
        longitude,
        city: '',
        province: '',
        country: 'South Africa',
      };
    }

    const address = item.address || {};
    const city =
      address.city ||
      address.town ||
      address.village ||
      address.suburb ||
      address.county ||
      '';
    const province = address.state || address.province || address.region || '';
    const country = address.country || 'South Africa';

    const parts = item.display_name.split(',').map((p) => p.trim());
    const cleanLabel = parts.length > 4 ? parts.slice(0, 4).join(', ') : item.display_name;

    return {
      placeId: String(item.place_id || item.osm_id || `loc-${Date.now()}`),
      formattedAddress: cleanLabel,
      fullAddress: item.display_name,
      latitude,
      longitude,
      city,
      province,
      country,
    };
  } catch (error) {
    console.error('Reverse geocode error:', error.message);
    return {
      placeId: `custom-${latitude.toFixed(4)}-${longitude.toFixed(4)}`,
      formattedAddress: `Selected Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
      fullAddress: `Selected Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
      latitude,
      longitude,
      city: '',
      province: '',
      country: 'South Africa',
    };
  }
};

/**
 * Calculates road routing between origin and destination coordinates
 * @param {number} originLat 
 * @param {number} originLng 
 * @param {number} destinationLat 
 * @param {number} destinationLng 
 */
const getRoute = async (originLat, originLng, destinationLat, destinationLng) => {
  const startLat = parseFloat(originLat);
  const startLng = parseFloat(originLng);
  const endLat = parseFloat(destinationLat);
  const endLng = parseFloat(destinationLng);

  if (
    isNaN(startLat) ||
    isNaN(startLng) ||
    isNaN(endLat) ||
    isNaN(endLng)
  ) {
    throw new Error('Valid origin and destination coordinates are required.');
  }

  try {
    // OSRM routing endpoint: longitude,latitude;longitude,latitude
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`OSRM routing failed: ${res.statusText}`);
    }

    const data = await res.json();
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const distanceMeters = Math.round(route.distance);
      const durationSeconds = Math.round(route.duration);
      const distanceKm = parseFloat((route.distance / 1000).toFixed(1));
      const durationMins = Math.round(route.duration / 60);

      // Convert OSRM coordinates [lng, lat] to Leaflet/Standard [lat, lng]
      const polylineCoordinates = route.geometry.coordinates.map((coord) => [
        coord[1],
        coord[0],
      ]);

      return {
        distanceMeters,
        durationSeconds,
        distanceKm,
        durationMins,
        distanceText: formatDistance(distanceMeters),
        durationText: formatDuration(durationSeconds),
        polylineCoordinates,
        polyline: JSON.stringify(polylineCoordinates),
      };
    }

    throw new Error('No route found from routing provider.');
  } catch (error) {
    console.error('Routing calculation error, using fallback:', error.message);
    // Haversine fallback if routing service is unreachable
    const distKm = haversineDistance(startLat, startLng, endLat, endLng);
    const distMeters = Math.round(distKm * 1000);
    // Approximate average speed of 70 km/h on highway
    const durationSec = Math.round((distKm / 70) * 3600);

    const straightLine = [
      [startLat, startLng],
      [endLat, endLng],
    ];

    return {
      distanceMeters: distMeters,
      durationSeconds: durationSec,
      distanceKm: parseFloat(distKm.toFixed(1)),
      durationMins: Math.round(durationSec / 60),
      distanceText: formatDistance(distMeters),
      durationText: formatDuration(durationSec),
      polylineCoordinates: straightLine,
      polyline: JSON.stringify(straightLine),
    };
  }
};

module.exports = {
  searchLocations,
  reverseGeocode,
  getRoute,
};
