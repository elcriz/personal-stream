const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/user');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(options, (jwt_payload, done) => {
  User
    .findOne({ _id: jwt_payload._id }, (error, user) => {
      if (error) {
        return done(error, false);
      }
      return done(null, (user || false));
    });
}));
