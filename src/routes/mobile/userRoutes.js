const express = require('express');
const router = express.Router();
const checkAuth = require('../../middleware/mobile/authMiddleware');
const userController = require('../../controllers/mobile/user/userController');
const userEventController = require('../../controllers/mobile/user/userEventController');
const userOrderController = require('../../controllers/mobile/user/userOrderController');
const userNewsfeedController = require('../../controllers/mobile/user/userNewsfeedController');
const userReportController = require('../../controllers/mobile/user/userReportController');
const userReviewController = require('../../controllers/mobile/user/userReviewController');

// User profile
router.get('/profile', checkAuth, userController.showUser);
router.post('/profile/update', checkAuth, userController.updateUserProfile);
router.post('/profile/password', checkAuth, userController.updateUserPassword);
router.post('/profile/location', checkAuth, userController.updateUserLocation);

// Events
router.post('/event', checkAuth, userEventController.createEvent);
router.post('/event/:id/join', checkAuth, userEventController.joinEvent);

// Orders
router.post('/order/sale', checkAuth, userOrderController.createSaleOrderUser);
router.post('/order/groupbuy', checkAuth, userOrderController.createGroupbuyOrder);

// Newsfeed
router.post('/newsfeed', checkAuth, userNewsfeedController.createNewsfeed);
router.post('/newsfeed/:id/reply', checkAuth, userNewsfeedController.replyNewsfeed);
router.post('/newsfeed/:id/like', checkAuth, userNewsfeedController.addLike);

// Reports
router.post('/report/product', checkAuth, userReportController.createProductReport);
router.post('/report/seller', checkAuth, userReportController.createSellerReport);

// Reviews
router.post('/review/product', checkAuth, userReviewController.createProductReview);
router.post('/review/product/:id/update', checkAuth, userReviewController.updateProductReview);
router.post('/review/seller', checkAuth, userReviewController.createSellerReview);
router.post('/review/seller/:id/update', checkAuth, userReviewController.updateSellerReview);

module.exports = router;
