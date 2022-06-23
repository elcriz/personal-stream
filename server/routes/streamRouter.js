const express = require('express');
const {
  getItems,
  getItem,
  getTags,
  addItem,
  deleteItem,
  updateItem,
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
router.delete('/item/:id', verifyUser, deleteItem);

// Update an item
router.patch('/item/:id', verifyUser, updateItem);

module.exports = router;
