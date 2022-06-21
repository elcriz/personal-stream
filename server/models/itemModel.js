const mongoose = require('mongoose');

const Item = new mongoose.Schema({
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
});

module.exports = mongoose.model('Item', Item);
