const express = require('express');

const {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  searchNearbyUsers
} = require('../controllers/userController');

const router = express.Router();

// Basic CRUD
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.get('/users/:id', getSingleUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Advanced Requirements
router.post('/users/signin', userSignIn);
router.post('/users/follow', userFollow);
router.post('/users/search', searchNearbyUsers);

module.exports = router;

