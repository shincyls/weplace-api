const express = require('express');
const logger = require('../middleware/loggerMiddleware');

const {
  localSignIn,
  googleSignIn,
  googleCallback,
  googleLogout
} = require('../controllers/authController');

const router = express.Router();

// Advanced Requirements
router.post('/local', logger, localSignIn);
router.get('/google', googleSignIn);
router.get('/google/callback', googleCallback);
router.get('/google/logout', googleLogout);

module.exports = router;

