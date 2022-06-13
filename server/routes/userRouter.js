const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

const {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
  verifyUser,
} = require('../authenticate');

router.post('/signup', (req, res, next) => {
  if (!req.body.firstName) {
    res.status(500).send({
      name: 'FirstNameError',
      message: 'The first name is required',
    });
  }
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (error, user) => {
      if (error) {
        res.status(500).send(error);
      }
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName || '';

      const token = getToken({ _id: user._id });
      const refreshToken = getRefreshToken({ _id: user._id });

      user.refreshToken.push({ refreshToken });
      user.save((error, user) => {
        if (error) {
          res.status(500).send(error);
        }
        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
        res.send({ success: true, token });
      });
    }
  );
});

router.post('/login', passport.authenticate('local'), (req, res, next) => {
  const token = getToken({ _id: req.user._id });
  const refreshToken = getRefreshToken({ _id: req.user._id });
  User
    .findById(req.user._id)
    .then((user) => {
      user.refreshToken.push({ refreshToken });
      user.save((error) => {
        if (error) {
          res.status(500).send(error);
        }
        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
        res.send({ success: true, token });
      })
    }, error => next(error));
});

router.get('/me', verifyUser, (req, res, next) => {
  res.status(200).send(req.user);
});

router.get('/logout', verifyUser, (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  User
    .findById(req.user._id)
    .then((user) => {
      const tokenIndex = user.refreshToken.findIndex(
        item => item.refreshToken === refreshToken,
      );

      if (tokenIndex !== -1) {
        user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
      }

      user.save((error, user) => {
        if (error) {
          res.status(500).send(error);
        }
        res.clearCookie('refreshToken', COOKIE_OPTIONS);
        res.send({ success: true });
      });
    }, error => next(error));
});

module.exports = router;
