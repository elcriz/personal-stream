const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const corsProxy = require('pass-cors');
const Item = require('./models/item');

const isDevelopment = process.env.NODE_ENV !== 'production';

if (isDevelopment) {
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
const { getError } = require('./utils/generic');
const { verifyUser } = require('./authenticate');

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

app.use('/proxy', corsProxy);

app.get('/', (req, res) => {
  res.send({ status: 'success ' });
});

app.get('/stream', (req, res) => {
  const { tag, page = 1, limit = 5 } = req.query;

  async function getCount(tag) {
    return await Item
      .countDocuments(tag ? { tags: { $in: [tag] } } : {})
      .then((amount) => {
        return Promise.resolve(amount);
      }, () => {
        getError(res, 'Could not count the documents.');
      });
  }

  Item
    .find(tag ? { tags: { $in: [tag] } } : {})
    .sort('-time')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .then(async (items) => {
      const amount = await getCount(tag);
      res.status(200).json({ items, amount });
    }, () => {
      getError(res, 'Could not fetch the documents.');
    });
});

app.post('/stream', verifyUser, (req, res) => {
  if (req.user.role !== 1) {
    res.status(401).send();
  }
  Item
    .create(new Item({
      title: req.body.title,
      tags: req.body.tags,
      body: req.body.body,
      images: req.body.images,
      videos: req.body.videos,
      links: req.body.links,
    }))
    .then((result) => {
      res.status(201).json(result);
    }, () => {
      getError(res, 'Could not add document', 201);
    });
});

app.get('/stream/:id', (req, res) => {
  const { id } = req.params;
  Item
    .findById(id)
    .then((item) => {
      res.status(200).json(item);
    }, () => {
      getError(res, 'Could not fetch the document.');
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
      getError(res, 'Could not fetch the documents.');
    });
});

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening at port ${server.address().port}.`);
});
