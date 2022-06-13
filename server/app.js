const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const Item = require('./models/item');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: './.env' })
}

require('./utils/db');
require('./utils/generic');
require('./strategies/JwtStrategy');
require('./strategies/LocalStrategy');
require('./authenticate');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
const userRouter = require('./routes/userRouter');

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(',')
  : [];

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

app.get('/', (req, res) => {
  res.send({ status: 'success ' });
});

app.get('/stream', (req, res) => {
  const page = req.query.page || 0;
  const itemsPerPage = req.query.itemsAmount || 5;
  const { tag } = req.query;

  Item
    .find(tag ? { tags: { $in: [tag] } } : {})
    .sort('-time')
    .skip(page * itemsPerPage)
    .limit(itemsPerPage)
    .then((items) => {
      res.status(200).json(items);
    }, () => {
      getError('Could not fetch the documents.');
    });
});

app.get('/stream/:id', (req, res) => {
  const { id } = req.params;
  Item
    .findById(id)
    .then((item) => {
      res.status(200).json(item);
    }, () => {
      getError('Could not fetch the document.');
    });
});

app.get('/tags', (_, res) => {
  Item
    .find()
    .select(['tags'])
    .then((items) => {
      const tags = items.reduce((previous, item) => ([
        ...previous,
        ...item.tags.filter(tag => previous.indexOf(tag) === -1),
      ]), []).sort();
      res.status(200).json(tags);
    }, () => {
      getError('Could not fetch the documents.');
    });
});

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening at port ${server.address().port}.`);
});
