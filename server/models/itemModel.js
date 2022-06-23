const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    default: '',
  },
  tags: {
    type: Array,
    default: [],
  },
  body: {
    type: String,
    default: '',
  },
  images: {
    type: Array,
    default: [],
  },
  videos: {
    type: Array,
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
