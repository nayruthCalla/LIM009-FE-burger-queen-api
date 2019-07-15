const db = require('../services/connection');

module.exports = {
  createUser: async (collection, dbUrl, ...document) => {
    const user = await (await db(dbUrl))
      .collection(collection)
      .insertOne(document[0]);
    return user;
  },
  updateUser: async (collection, dbUrl, idDocument, ...document) => {
    const user = await (await db(dbUrl))
      .collection(collection)
      .updateOne({ _id: idDocument },
        { $set: document[0] });
    return user;
  },
  deleteUser: async (collection, dbUrl, idDocument) => {
    const user = await (await db(dbUrl))
      .collection(collection)
      .deleteOne({ _id: idDocument });
    return user;
  },
};
