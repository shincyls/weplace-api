const express = require('express');
const logger = require('../../middleware/mobile/loggerMiddleware');

const {
  localSignIn,
  googleSignIn,
  googleCallback,
  googleLogout
} = require('../../controllers/mobile/auth/authController');

const router = express.Router();

// localSignIn is the route for users to login using email and password with inhouse database (local strategy)
router.post('/local', logger, localSignIn);
router.get('/google', googleSignIn);
router.get('/google/callback', googleCallback);
router.get('/google/logout', googleLogout);

module.exports = router;

