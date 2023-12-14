const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const hikeSchema = new Schema(
  {
    dateTime: Date,
    location: String,
    distance: {
      type: Number,
      default: 0,
    },
    elevationGain: {
      type: Number,
      default: 0,
    },
    duration: {
      moving: {
        type: Number,
        default: 0,
      },
      stopped: {
        type: Number,
        default: 0,
      },
    },
    speed: {
      moving: {
        type: Number,
        default: 0,
      },
      overall: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true },
);

module.exports = model('Hike', hikeSchema);
