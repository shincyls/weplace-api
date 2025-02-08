const express = require('express');

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  updateUserLocation,
  userProductsLive,
  userProductsHistory,
  userProductOrderUserAdd,
  userProductOrderUserPayment,
  userProductOrderUserCancel,
  userProductUserReview
} = require('../controllers/userController');

const router = express.Router();
const checkAuth = require('../middleware/authMiddleware');
// const logger = require('../middleware/loggerMiddleware');

// Basic CRUD
router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id/update', checkAuth, updateUser);
router.delete('/:id/remove', checkAuth, deleteUser);

// Advanced Requirements
router.put('/:id/update/password', checkAuth, updateUserPassword);
router.put('/:id/update/location', checkAuth, updateUserLocation);

// Advanced Requirements, required location_id
router.post('/products/live', checkAuth, userProductsLive); // get all productOrder where productOrder.startTime<today and endtime>today where req.user.location_id is in productOrder.locationIds
router.post('/products/history', checkAuth, userProductsHistory); // get all productOrder where productOrder.endtime<today where req.user.location_id is in productOrder.locationIds and sellerId=req.user.id
router.post('/product/order', checkAuth, userProductOrderUserAdd); // create productOrderUser where productOrderId=req.body.productOrderId
router.post('/product/payment', checkAuth, userProductOrderUserPayment); // update productOrderUser where productOrderId=req.body.productOrderId
router.post('/product/cancel', checkAuth, userProductOrderUserCancel); //  update productOrderUser where productOrderId=req.body.productOrderId
router.post('/product/review', checkAuth, userProductUserReview); // create productUserReview where productOrderId=req.body.productOrderId

module.exports = router;

