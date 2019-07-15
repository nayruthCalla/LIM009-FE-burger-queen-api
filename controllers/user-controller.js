const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const { dbUrl } = require('../config');
const { isAdmin } = require('../middleware/auth');
const { searchDataBase, showListCollections } = require('../models/general-model');
const { createUser, updateUser, deleteUser } = require('../models/users-model');


module.exports = {
  controllerCreateUser: async (req, resp, next) => {
    const { email, password, roles } = req.body;
    // console.log(req)
    if (!email || !password) {
      return next(400);
    }
    const user = await searchDataBase('users', dbUrl, { email });
    if (user != null) {
      return next(403);
    }
    const statusRol = (typeof roles === 'object')
      ? (!roles.admin) ? false : roles.admin
      : false;
    const newUser = await createUser('users', dbUrl, { email, password: bcrypt.hashSync(password, 10), roles: { admin: statusRol } });
    return resp.send({
      _id: newUser.ops[0]._id,
      email: newUser.ops[0].email,
      roles: newUser.ops[0].roles,
    });
  },
  controllerGetAllUsers: async (req, resp) => {
    // console.info(req.query);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = ((limit * page) - limit);

    const users = await showListCollections('users', dbUrl, skip, limit);
    const usersList = users.map(user => ({
      _id: user._id,
      email: user.email,
      roles: { admin: user.roles.admin },
    }));
    resp.send(usersList);
  },
  controllerGetUserById: async (req, resp, next) => {
    // console.log(req.params.uid)
    const emailOrId = req.params.uid;
    let searchEmailOrId;
    try {
      searchEmailOrId = { _id: new ObjectId(emailOrId) };
    } catch (error) {
      searchEmailOrId = { email: emailOrId };
    }
    const user = await searchDataBase('users', dbUrl, searchEmailOrId);
    if (!user) {
      return next(404);
    }
    resp.send({
      _id: user._id,
      email: user.email,
      roles: user.roles,
    });
  },
  controllerPutUserById: async (req, resp, next) => {
    const { email, password, roles } = req.body;
    if (roles && roles.admin && !isAdmin(req)) {
      return next(403);
    }
    if (email.trim().length === 0 || password.trim().length === 0) {
      return next(400);
    }
    const emailOrId = req.params.uid;
    let searchEmailOrId;
    try {
      searchEmailOrId = { _id: new ObjectId(emailOrId) };
    } catch (error) {
      searchEmailOrId = { email: emailOrId };
    }
    const user = await searchDataBase('users', dbUrl, searchEmailOrId);
    if (!user) {
      return next(404);
    }
    const statusRol = (typeof roles === 'object')
      ? (!roles.admin) ? false : roles.admin
      : false;
    await updateUser('users', dbUrl, user._id, { email, password: bcrypt.hashSync(password, 10), roles: { admin: statusRol } });
    const updateUserOne = await searchDataBase('users', dbUrl, searchEmailOrId);
    return resp.send({
      _id: updateUserOne._id,
      email: updateUserOne.email,
      roles: updateUserOne.roles,
    });
  },
  controllerDeleteUserById: async (req, resp, next) => {
    const emailOrId = req.params.uid;
    const { roles } = req.body;
    if (roles && roles.admin && !isAdmin(req)) {
      return next(403);
    }
    let searchEmailOrId;
    try {
      searchEmailOrId = { _id: new ObjectId(emailOrId) };
    } catch (error) {
      searchEmailOrId = { email: emailOrId };
    }
    const user = await searchDataBase('users', dbUrl, searchEmailOrId);
    if (!user) {
      return next(404);
    }
    await deleteUser('users', dbUrl, user._id);
    return resp.send({
      _id: user._id,
      email: user.email,
      roles: user.roles,
    });
  },
};
// const createUserAdmin = async (adminUser, next) => {
//   const dbo = await db();
//   const user = await dbo
//     .collection('users')
//     .findOne({ email: adminUser.email });
//   if (!user) {
//     await dbo.collection('users').insertOne(adminUser);
//     next();
//   }
