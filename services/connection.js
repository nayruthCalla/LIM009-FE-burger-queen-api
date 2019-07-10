const { MongoClient } = require('mongodb');
const config = require('../config');

module.exports = async () => {
  const { dbUrl } = config;
  const dbName = 'burger-queen';
  const client = new MongoClient(dbUrl, { useNewUrlParser: true });
  try {
    await client.connect();
    const db = client.db(dbName);
    return db;
  } catch (err) {
    return console.log(err.stack);
  }
};
