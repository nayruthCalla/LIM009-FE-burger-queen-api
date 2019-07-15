/*const { MongoClient } = require('mongodb');
const config = require('../config');

module.exports = async () => {
  const { dbUrl } = config;
  const client = new MongoClient(dbUrl, { useNewUrlParser: true });
  try {
    await client.connect();
    const db = client.db();
    console.info('base de datos conectada');
    return db;
  } catch (err) {
    console.log(err.stack);
  }
  client.close();
};*/

const { MongoClient } = require('mongodb');
const { dbUrl } = require('../config');

let db;

module.exports = () => {
  if (!db) {
    const MonClient = MongoClient(dbUrl, { useNewUrlParser: true });
    return MonClient.connect().then((client) => {
      db = client.db();
      console.info('Connect to DataBase');
      return db;
    });
  }
  return Promise.resolve(db);
};
