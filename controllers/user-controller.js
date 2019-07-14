const { ObjectId } = require('mongodb');
const { createUser, updateUser, deleteUser } = require('../models/users-model');
const { searchDataBase } = require('../models/general-model');
const { isAdmin } = require('../middleware/auth');


module.exports = {
  controllerCreateUser: async (req, resp, next) => {
    const { email, password, roles } = req.body;
    // console.log(req);
    if (!email || !password) {
      return next(400);
    }
    const user = await searchDataBase('users', { email });
    if (user != null) {
      return next(403);
    }
    const newUser = await createUser(email, password, roles);
    return resp.send({
      _id: newUser.ops[0]._id,
      email: newUser.ops[0].email,
      roles: newUser.ops[0].roles,
    });
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
    const user = await searchDataBase('users', searchEmailOrId);
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
    const user = await searchDataBase('users', searchEmailOrId);
    if (!user) {
      return next(404);
    }
    await updateUser(user._id, email, password);
    const updateUserOne = await searchDataBase('users', searchEmailOrId);
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
    const user = await searchDataBase('users', searchEmailOrId);
    if (!user) {
      return next(404);
    }
    await deleteUser(user._id);
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
