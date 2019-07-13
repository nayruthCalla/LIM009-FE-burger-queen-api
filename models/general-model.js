const db = require('../services/connection');

module.exports = {
  searchDataBase: async (collection, documents) => {
    const result = await (await db())
      .collection(collection)
      .findOne(documents);
    return result;
  },
  db: () => 'hola',

};
