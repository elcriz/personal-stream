const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const subscriberModel = new Schema(
  {
    subscription: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true },
);

module.exports = model('Subscriber', subscriberModel);
