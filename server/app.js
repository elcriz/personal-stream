const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './.env', });
const port = process.env.PORT || 5000;

const getError = (res, error, code = 500) => res.status(code).json({ error });

// Init app and middleware
const app = express();
app.use(cors());
app.use(express.json());

// Connect to database
const { getDb, connectToDb } = require('./db');
const { ObjectId } = require('mongodb');

let db;

connectToDb((error) => {
  if (error) {
    console.error(error);
    return;
  }
    app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
  db = getDb();
});

// Routes
app.get('/stream', (req, res) => {
  const page = req.query.page || 0;
  const itemsPerPage = req.query.itemsAmount || 5;
  const { tag } = req.query;
  console.log({ tag });

  db.collection('stream')
    .find(tag ? { tags: { $in: [tag] } } : {})
    .sort({ time: -1 })
    .skip(page * itemsPerPage)
    .limit(itemsPerPage)
    .toArray((error, result) => {
      if (error) {
        getError('Could not fetch the documents');
      }
      res.status(200).json(result);
    })
});

app.get('/stream/:id', (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    getError('Could not fetch the document');
    return;
  }

  db.collection('stream')
    .findOne({ _id: new ObjectId(id) }, (error, result) => {
      if (error) {
        getError('Could not fetch the document');
      }
      res.status(200).json(result);
    });
});

app.get('/tags', (_, res) => {
  db.collection('stream')
    .find()
    .project({ tags: 1, _id: 0 })
    .toArray((error, result) => {
      if (error) {
        getError('Could not fetch the documents');
      }
      const tags = result.reduce((previous, item) => ([
        ...previous,
        ...item.tags.filter(tag => previous.indexOf(tag) === -1),
      ]), []).sort();
      res.status(200).json(tags);
    });
});
