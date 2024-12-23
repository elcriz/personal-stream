const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const corsProxy = require('pass-cors');

const isDevelopment = process.env.NODE_ENV !== 'production';

if (isDevelopment) {
  require('dotenv').config({ path: './.env' });
}

require('./strategies/JwtStrategy');
require('./strategies/LocalStrategy');
require('./utils/authenticate');

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'client', 'dist')));

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path}`);
  next();
});

const whitelist = process.env.WHITELISTED_DOMAINS ? process.env.WHITELISTED_DOMAINS.split(',') : [];

app.use(bodyParser.json());

app.use(cookieParser(process.env.COOKIE_SECRET));

const userRouter = require('./routes/userRouter');
const streamRouter = require('./routes/streamRouter');
const feedRouter = require('./routes/feedRouter');
const hikesRouter = require('./routes/hikes/hikesRouter');
const whamhunterRouter = require('./routes/whamhunter/whamhunterRouter');
const pushSubscribeRouter = require('./routes/pushSubscribeRouter');

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS.'));
    },
  }),
);

app.use(passport.initialize());

app.use('/api/notifications', pushSubscribeRouter);

app.use('/api/users', userRouter);

app.use('/api/stream', streamRouter);

app.use('/api/proxy', corsProxy);

app.use('/feed.xml', feedRouter);

app.use('/api/hikes', hikesRouter);

app.use('/api/whamhunter', whamhunterRouter);

mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => {
    console.log('Connected to database.');

    app.get('*', (_, res) => {
      console.log('Serving up React build html');
      res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
    });

    const server = app.listen(process.env.PORT || 5000, () => {
      console.log(`Server listening at port ${server.address().port}.`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
