const db = require('../services/connection');

module.exports = {
  searchDataBase: async (collection, dbUrl, documents) => {
    const result = await (await db(dbUrl))
      .collection(collection)
      .findOne(documents);
    return result;
  },

  showListCollections: async (collection, dbUrl, skip, limit) => {
    const result = await (await db(dbUrl))
      .collection(collection)
      .find({}).skip(skip)
      .limit(limit)
      .toArray();
    return result;
  },
};
