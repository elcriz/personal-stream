const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const sessionSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    default: '',
  },
});

const userSchema = new mongoose.Schema({
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
}, { timestamps: true });

userSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    delete ret.refreshToken;
    return ret;
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
