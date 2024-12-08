const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const playerSchema = new Schema(
  {
    name: {
      type: String,
      defaut: '',
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = model('Player', playerSchema);
