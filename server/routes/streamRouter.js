const express = require('express');
const {
  getItems,
  getItem,
  getTags,
  addItem,
  deleteItem,
} = require('../controllers/itemController');
const { verifyUser } = require('../utils/authenticate');
const router = express.Router();

// Get all items
router.get('/', getItems);

// Get a single item
router.get('/item/:id', getItem);

// Get all tags
router.get('/tags', getTags);

// Add a new item
router.post('/item', verifyUser, addItem);

// Delete an item
router.delete('/item', verifyUser, deleteItem);

module.exports = router;
