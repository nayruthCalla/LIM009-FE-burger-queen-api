const { ObjectId } = require('mongodb');
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
