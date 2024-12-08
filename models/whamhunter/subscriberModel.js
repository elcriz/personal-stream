const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const subscriberModel = new Schema(
  {
    subscription: {
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = model('Subscriber', subscriberModel);
