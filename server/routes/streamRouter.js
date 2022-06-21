const express = require('express');
const Item = require('../models/item');
const { getError } = require('../utils/generic');
const router = express.Router();

const { verifyUser } = require('../utils/authenticate');

router.get('/', (req, res) => {
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

router.get('/item/:id', (req, res) => {
  const { id } = req.params;
  Item
    .findById(id)
    .then((item) => {
      res.status(200).json(item);
    }, () => {
      getError(res, 'Could not fetch the document.');
    });
});

router.post('/item', verifyUser, (req, res) => {
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

router.get('/tags', (_, res) => {
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

module.exports = router;
