const { MongoClient } = require('mongodb');

module.exports = async (dbUrl) => {
  const dbName = 'burger-queen';
  const client = new MongoClient(dbUrl, { useNewUrlParser: true });
  try {
    await client.connect();
    const db = client.db(dbName);
    return db;
  } catch (err) {
    console.log(err.stack);
  }
  client.close();
};
