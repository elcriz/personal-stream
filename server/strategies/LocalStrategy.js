const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// During login/sign up
passport.use(new LocalStrategy(User.authenticate()));

// After logging in/signing up to add user details to req.user
passport.serializeUser(User.serializeUser());
