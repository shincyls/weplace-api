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


// Basic CRUD

// createUser do not need checkAuth as for user to SignUp, they should not be logged in yet
router.post('/', createUser);
router.get('/', checkAuth, logger, getAllUsers);
router.get('/:id', checkAuth, getSingleUser);
router.put('/:id/update', checkAuth, updateUser);
router.delete('/:id/remove', checkAuth, deleteUser);

// Advanced Requirements

router.post('/:id/follow', checkAuth, logger, userFollow);
router.post('/:id/unfollow', checkAuth, logger, userUnfollow);
router.get('/:id/nearby', checkAuth, searchFollowersAndFollowingsNearby);

module.exports = router;

