const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const db = require('../services/connection');

module.exports = secret => (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return next(403);
    }
    // TODO: Verificar identidad del usuario usando `decodeToken.uid`
    console.info(decodedToken);
    db()
      .then((db) => {
        db.collection('users').findOne({ _id: new ObjectId(decodedToken.uid) })
          .then((user) => {
            Object.assign(req, { userAuth: { id: user._id, role: user.roles.admin } });
            next();
          });
      });
  });
};


module.exports.isAuthenticated = req => (
  // TODO: decidir por la informacion del request si la usuaria esta autenticada
  console.info(req.userAuth)
  // false
);


module.exports.isAdmin = req => (
  // TODO: decidir por la informacion del request si la usuaria es admin
  false
);


module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);


module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);