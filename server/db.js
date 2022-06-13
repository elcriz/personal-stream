const { MongoClient } = require('mongodb');

let dbConnection;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(process.env.URI)
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((error) => {
        console.error(error);
        return cb(error);
      })
  },
  getDb: () => dbConnection,
};
