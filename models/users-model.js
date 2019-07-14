const bcrypt = require('bcrypt');
const db = require('../services/connection');

module.exports = {
  createUser: async (email, password, rol) => {
    const statusRol = (typeof rol === 'object')
      ? (!rol.admin) ? false : rol.admin
      : false;
    const user = await (await db())
      .collection('users')
      .insertOne({ email, password: bcrypt.hashSync(password, 10), roles: { admin: statusRol } });
    return user;
  },
  updateUser: async (idUser, email, password, rol) => {
    // console.log(typeof idUser,idUser)
    const statusRol = (typeof rol === 'object')
      ? (!rol.admin) ? false : rol.admin
      : false;
    const user = await (await db())
      .collection('users')
      .updateOne({ _id: idUser },
        { $set: { email, password: bcrypt.hashSync(password, 10), roles: { admin: statusRol } } });
    return user;
  },
  deleteUser: async (idUser) => {
    const user = await (await db())
      .collection('users')
      .deleteOne({ _id: idUser });
    return user;
  },
};
