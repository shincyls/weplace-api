const express = require('express');
const router = express.Router();
const checkAuth = require('../../middleware/mobile/authMiddleware');

const locationController = require('../../controllers/mobile/location/locationController');
const locationEventController = require('../../controllers/mobile/location/locationEventController');
const locationGroupbuyController = require('../../controllers/mobile/location/locationGroupbuyController');
const locationNewsfeedController = require('../../controllers/mobile/location/locationNewsfeedController');
const locationSaleController = require('../../controllers/mobile/location/locationSaleController');

// Location base
router.get('/', checkAuth, locationController.getLocations);
router.get('/nearby', checkAuth, locationController.getNearbyLocations);

// Events for a location
router.get('/events', checkAuth, locationEventController.getLocationEvents);

// Groupbuys for a location
router.get('/groupbuys', checkAuth, locationGroupbuyController.getLocationGroupbuys);

// Newsfeed for a location
router.get('/newsfeed', checkAuth, locationNewsfeedController.getLocationNewsfeed);

// Sales for a location
router.get('/sales', checkAuth, locationSaleController.getLocationSales);

module.exports = router;



