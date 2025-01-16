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

// Basic CRUD
router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/:id', getSingleUser);
router.put('/:id/update', updateUser);
router.delete('/:id/remove', deleteUser);

// Advanced Requirements
router.post('/:id/follow', userFollow);
router.post('/:id/unfollow', userUnfollow);
router.post('/:id/nearby', searchNearbyUsers);

module.exports = router;

