const Item = require('../models/itemModel');
const mongoose = require('mongoose');

// Get the total amount of items
const getAmount = async (tag) => {
  return await Item
    .countDocuments(tag ? { tags: { $in: [tag] } } : {});
};

// Get all items
const getItems = async (req, res) => {
  const { tag, page = 1, limit = 5 } = req.query;
  const amount = await getAmount(tag);
  const items = await Item
    .find(tag ? { tags: { $in: [tag] } } : {})
    .sort('-time')
    .limit(limit * 1)
    .skip((page - 1) * limit);
  res.status(200).json({ amount, items });
};

// Get a single item
const getItem = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such item found' });
  }

  const item = await Item
    .findById(id);

  if (!item) {
    return res.status(404).json({ error: 'No such item found' });
  }
  res.status(200).json(item);
};

// Get all tags
const getTags = async (req, res) => {
  const allTags = await Item
    .find()
    .select(['tags']);
  const serializedTags = allTags.reduce((previous, item) => ([
    ...previous,
    ...item.tags.filter(tag => previous.indexOf(tag) === -1),
  ]), []).sort();
  res.status(200).json(serializedTags);
};

// Add a new item
const addItem = async (req, res) => {
  if (req.user.role !== 1) {
    return res.status(401).send();
  }
  const { title, tags, body, images, videos } = req.body;
  try {
    const newItem = await Item
      .create(new Item({ title, tags, body, images, videos }));
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAmount,
  getItems,
  getItem,
  getTags,
  addItem,
};
