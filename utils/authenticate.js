const passport = require('passport');
const jwt = require('jsonwebtoken');
const isDevelopment = process.env.NODE_ENV !== 'production';

exports.COOKIE_OPTIONS = {
  httpOnly: true,
  secure: !isDevelopment,
  secure: false,
  signed: true,
  maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY) * 10000,
  sameSite: 'none',
};

exports.getToken = (user) =>
  jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: eval(process.env.SESSION_EXPIRY),
  });

exports.getRefreshToken = (user) =>
  jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY),
  });

exports.verifyUser = passport.authenticate('jwt', { session: false });
