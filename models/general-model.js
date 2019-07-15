const db = require('../services/connection');

module.exports = {
  searchDataBase: async (collectionName, documents) => {
    const result = await (await db())
      .collection(collectionName)
      .findOne(documents);
    return result;
  },
  showListCollections: async (collectionName, skip, limit) => {
    const result = await (await db())
      .collection(collectionName)
      .find({}).skip(skip)
      .limit(limit)
      .toArray();
    return result;
  },
};
