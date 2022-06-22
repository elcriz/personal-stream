const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    default: '',
  },
  time: {
    type: String,
    default: new Date().getTime(),
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
  links: {
    type: Array,
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
