const express = require('express');

const {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  userFollow,
  userUnfollow,
  searchNearbyUsers
} = require('../controllers/userController');

const router = express.Router();
const checkAuth = require('../middleware/authMiddleware');

// Basic CRUD

// createUser do not need checkAuth as for user to create an account, they should not be logged in
router.post('/', createUser);
router.get('/', checkAuth, getAllUsers);
router.get('/:id', checkAuth, getSingleUser);
router.put('/:id/update', checkAuth, updateUser);
router.delete('/:id/remove', checkAuth, deleteUser);

// Advanced Requirements

router.post('/:id/follow', checkAuth, userFollow);
router.post('/:id/unfollow', checkAuth, userUnfollow);
router.post('/:id/nearby', checkAuth, searchNearbyUsers);

module.exports = router;

