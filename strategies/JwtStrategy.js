const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/userModel');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const user = await User.findOne({ _id: jwt_payload._id });
      return done(null, user || false);
    } catch (error) {
      return done(error, false);
    }
  }),
);
