const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const { Schema, plugin, model } = mongoose;

plugin(slug);

const itemSchema = new Schema(
  {
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
    },
  },
  { timestamps: true },
);

module.exports = model('Item', itemSchema);
