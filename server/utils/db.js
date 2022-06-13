const mongoose = require('mongoose');
const url = process.env.MONGO_DB_CONNECTION_STRING;

const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect
  .then((db) => {
    console.log('Connected to database.');
  })
  .catch((error) => {
    console.error(error);
  });
