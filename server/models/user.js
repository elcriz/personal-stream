const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Session = new mongoose.Schema({
  refreshToken: {
    type: String,
    default: '',
  },
});

const User = new mongoose.Schema({
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
    type: [Session],
  },
});

User.set('toJSON', {
  transform: (doc, ret, options) => {
    delete ret.refreshToken;
    return ret;
  },
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
