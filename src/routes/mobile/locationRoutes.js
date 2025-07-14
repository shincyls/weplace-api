const express = require('express');

const {
  getAllLocations,
  getNearbyLocations,
  getLocation,
  updateLocation,
  deleteLocation
} = require('../controllers/mobile/location/locationController');

const router = express.Router();
const checkAuth = require('../middleware/mobile/authMiddleware');
// const logger = require('../middleware/mobile/loggerMiddleware');

// Basic CRUD
router.get('/', checkAuth, getAllLocations);
router.post('/', checkAuth, getNearbyLocations); // required lat lon
router.get('/:id', checkAuth, getLocation); // required :id = location_id
router.put('/:id/update', checkAuth, updateLocation); // required :id = location_id
router.delete('/:id/remove', checkAuth, deleteLocation); // required :id = location_id

module.exports = router;

