const express = require('express');
const logger = require('../middleware/loggerMiddleware');

const {
  localSignIn,
  googleSignIn
} = require('../controllers/authController');

const router = express.Router();

// Advanced Requirements
router.post('/local', logger, localSignIn);
router.post('/google', googleSignIn);

module.exports = router;

