const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const corsProxy = require('pass-cors');

const isDevelopment = process.env.NODE_ENV !== 'production';

if (isDevelopment) {
  require('dotenv').config({ path: './.env' })
}

require('./utils/db');
require('./utils/generic');
require('./strategies/JwtStrategy');
require('./strategies/LocalStrategy');
require('./utils/authenticate');

const app = express();

// Middleware
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path}`);
  next();
});

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(',')
  : [];

app.use(bodyParser.json());

app.use(cookieParser(process.env.COOKIE_SECRET));

const userRouter = require('./routes/userRouter');
const streamRouter = require('./routes/streamRouter');

app.use(cors({
  credentials: true,
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS.'));
  },
}));

app.use(passport.initialize());

app.use('/users', userRouter);

app.use('/stream', streamRouter);

app.use('/proxy', corsProxy);

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening at port ${server.address().port}.`);
});
