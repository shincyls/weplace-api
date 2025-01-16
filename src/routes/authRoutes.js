const express = require('express');

const {
  localSignIn,
  googleSignIn
} = require('../controllers/authController');

const router = express.Router();

// Advanced Requirements
router.post('/local', localSignIn);
router.post('/google', googleSignIn);

module.exports = router;

