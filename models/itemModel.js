const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    default: '',
  },
  slug: {
    type: String,
    slug: 'title',
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
  mediaPosition: {
    type: String,
    enum: ['top', 'bottom'],
    default: 'top',
  }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
