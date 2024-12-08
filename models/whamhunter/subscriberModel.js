const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const subscriberSchema = new Schema(
  {
    subscription: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true },
);

module.exports = model('Subscriber', subscriberSchema);
