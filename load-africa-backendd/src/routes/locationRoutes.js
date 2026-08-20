const express = require('express');
const {
  searchLocations,
  reverseGeocode,
  getRoute,
} = require('../controllers/locationController');

const router = express.Router();

// Autocomplete / Search locations
router.get('/search', searchLocations);

// Reverse Geocode (Coordinates -> Address)
router.get('/reverse-geocode', reverseGeocode);

// Route preview / road path calculation
router.get('/route', getRoute);
router.post('/route', getRoute);

module.exports = router;
