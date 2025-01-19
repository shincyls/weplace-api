const express = require('express');

const {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  userFollow,
  userUnfollow,
  searchFollowersAndFollowingsNearby
} = require('../controllers/userController');

const router = express.Router();
const checkAuth = require('../middleware/authMiddleware');
const logger = require('../middleware/loggerMiddleware');

// Routes that included checkAuth are routes that require user to be logged in
// Routes that included logger are routes that will log the request details, so we can flexibly add or remove logging for each route
// For simple showcase purpose, checkAuth only implemented in userFollow, userUnfollow to identify current user purpose. 
// In real world, we should implement checkAuth in all routes that require user to be logged in except signIn/signUp/forgetPassword/etc

// Basic CRUD
router.post('/', logger, createUser); // createUser do not need checkAuth as for user to SignUp, they should not be logged in yet
router.get('/', logger, getAllUsers);
router.get('/:id', logger, getSingleUser);
router.put('/:id/update', logger, updateUser);
router.delete('/:id/remove', logger, deleteUser);
// Advanced Requirements
router.post('/:id/follow', checkAuth, logger, userFollow);
router.post('/:id/unfollow', checkAuth, logger, userUnfollow);
router.get('/:id/nearby', logger, searchFollowersAndFollowingsNearby);

module.exports = router;

