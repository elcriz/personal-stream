const express = require('express');
const {
  getItems,
  getItem,
  getTags,
  addItem,
} = require('../controllers/itemController');
const { verifyUser } = require('../utils/authenticate');
const router = express.Router();

// Get all items
router.get('/', getItems);

// Get a single item
router.get('/item/:id', getItem);

// Add a new item
router.post('/item', verifyUser, addItem);

// Get all tags
router.get('/tags', getTags);

module.exports = router;
