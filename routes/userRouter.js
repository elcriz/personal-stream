const express = require('express');
const router = express.Router();
const {
  getMe,
  login,
  logout,
  signup,
  checkRefreshToken,
} = require('../controllers/userController');
const passport = require('passport');

const { verifyUser } = require('../utils/authenticate');

// Sign up a new user
router.post('/signup', signup);

// Sign in the user
router.post('/login', passport.authenticate('local'), login);

// Check refreshToken
router.post('/refreshToken', checkRefreshToken);

// Get current user details
router.get('/me', verifyUser, getMe);

// Log out the user
router.get('/logout', verifyUser, logout);

module.exports = router;
