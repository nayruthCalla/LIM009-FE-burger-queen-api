const { ObjectId } = require('mongodb');
<<<<<<< HEAD
const bcrypt = require('bcrypt');
const db = require('../services/connection');

module.exports = {
  getUserById: (req, resp, next) => {
    const emailOrId = req.params.uid;
    let search;
    try {
      search = { _id: new ObjectId(emailOrId) };
    } catch (err) {
      search = { email: emailOrId };
    }
    db()
      .then((db) => {
        db.collection('users').findOne(search)
          .then((user) => {
            // console.info(user);
            if (!user) {
              return next(404);
            }
            resp.send({ _id: user._id, email: user.email, roles: user.roles });
          });
      });
  },
  createUser: (req, resp, next) => {
    const { email, password, roles } = req.body;
    if (!email || !password) {
      return next(400);
    }
    db()
      .then((db) => {
        db.collection('users').findOne({ email }).then((user) => {
          if (user) {
            // Si ya existe Usuario
            return next(403);
          }
          db.collection('users').insertOne({ email, password: bcrypt.hashSync(password, 10), roles: { admin: roles } || { admin: false } })
            .then((newUser) => {
              // console.info(newUser);
              resp.send({
                _id: newUser.ops[0]._id,
                email: newUser.ops[0].email,
                roles: newUser.ops[0].roles,
              });
            });
        });
      });
  },
};
=======
const { createUser } = require('../models/users-model');
const { searchDataBase } = require('../models/general-model');


module.exports = {
  controllerCreateUser: async (req, resp, next) => {
    const { email, password, roles } = req.body;
    // console.log(req.body);
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
    })//falta terminar
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
>>>>>>> 900581a3355f3c6a3ffe0f7780c733f034f6e83a
