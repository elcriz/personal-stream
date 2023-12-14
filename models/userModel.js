const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { Schema, model } = mongoose;

const sessionSchema = new Schema({
  refreshToken: {
    type: String,
    default: '',
  },
});

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
    authStrategy: {
      type: String,
      default: 'local',
    },
    points: {
      type: Number,
      default: 50,
    },
    role: {
      type: Number,
      default: 0,
    },
    refreshToken: {
      type: [sessionSchema],
    },
  },
  { timestamps: true },
);

userSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    delete ret.refreshToken;
    return ret;
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = model('User', userSchema);
