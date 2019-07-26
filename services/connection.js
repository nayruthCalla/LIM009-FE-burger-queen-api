const { MongoClient } = require('mongodb');

let db = null;

module.exports = async (dbUrl) => {
  if (!db) {
    const client = new MongoClient(dbUrl, { useNewUrlParser: true });
    try {
      await client.connect();
      db = await client.db();
      console.info('base de datos conectada');
      return db;
    } catch (err) {
      console.info(err.stack);
    }
  }
  return db;
};

/*
const { MongoClient } = require('mongodb');

let db;

module.exports = (dbUrl) => {
  if (!db) {
    const MonClient = MongoClient(dbUrl, { useNewUrlParser: true });
    return MonClient.connect().then((client) => {
      db = client.db();
      console.info('Connect to DataBase');
      return db;
    });
  }
  return Promise.resolve(db);
}; */
