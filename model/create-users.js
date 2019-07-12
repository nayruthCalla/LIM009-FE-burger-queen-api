const bcrypt = require('bcrypt');
const db = require('../services/connection');

module.exports = {
  createUser: async (email, password, rol) => {
    const roles = rol === undefined ? { admin: false } : rol;
    const user = await (await db())
      .collection('users')
      .insertOne({ email, password: bcrypt.hashSync(password, 10), roles });
    return user;
  },
  searchBd: async (collection, dato) => {
    const result = await (await db())
      .collection(collection)
      .findOne(dato);
    return result;
  },

};
