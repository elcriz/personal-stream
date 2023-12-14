const User = require('../models/userModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { getToken, getRefreshToken, COOKIE_OPTIONS } = require('../utils/authenticate');

// Get current user details
const getMe = (req, res) => {
  const { user } = req;
  res.status(200).json(user);
};

// Sign in the user
const login = async (req, res, next) => {
  const { _id } = req.user;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ error: 'No user found' });
  }

  const token = getToken({ _id });
  const refreshToken = getRefreshToken({ _id });

  try {
    const user = await User.findById(_id);
    user.refreshToken.push({ refreshToken });
    user.save((error) => {
      if (error) {
        return res.status(500).send(error);
      }
      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
      res.send({
        success: true,
        role: req.user.role,
        token,
      });
    });
  } catch (error) {
    next(error);
  }
};

// Log out the user
const logout = async (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  const { _id } = req.user;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ error: 'No user found' });
  }

  try {
    const user = await User.findById(_id);
    const tokenIndex = user.refreshToken.findIndex((item) => item.refreshToken === refreshToken);

    if (tokenIndex !== -1) {
      user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
    }

    user.save((error) => {
      if (error) {
        return res.status(500).send(error);
      }
      res.clearCookie('refreshToken', COOKIE_OPTIONS);
      res.status(200).json({ success: true });
    });
  } catch (error) {
    next(error);
  }
};

// Sign up a new user
const signup = async (req, res) => {
  const {
    body: { username, firstName, lastName, password },
  } = req;
  const newUser = await User.register(new User({ username }), password, (error, user) => {
    if (error) {
      return res.status(500).json({ error });
    }
    user.firstName = firstName;
    user.lastName = lastName;

    const token = getToken({ _id: user._id });
    const refreshToken = getRefreshToken({ _id: user._id });

    user.refreshToken.push({ refreshToken });
    user.save((error, user) => {
      if (error) {
        res.status(500).json({ error });
      }
      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
      res.json({ success: true, token });
    });
  });
};

// Check refreshToken
const checkRefreshToken = async (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  if (!refreshToken) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userId = payload._id;
    const user = await User.findById(_id);

    if (!user) {
      return res.status(401).send('Unauthorized');
    }

    const tokenIndex = user.refreshToken.findIndex((item) => item.refreshToken === refreshToken);

    if (tokenIndex === -1) {
      res.status(401).send('Unauthorized');
    }

    const token = getToken({ _id: userId });
    const newRefreshToken = getRefreshToken({ _id: userId });
    user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };

    User.save((error) => {
      if (error) {
        res.status(500).send(error);
      }
      res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);
      res.send({
        success: true,
        role: req.user.role,
        token,
      });
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMe,
  login,
  logout,
  signup,
  checkRefreshToken,
};
