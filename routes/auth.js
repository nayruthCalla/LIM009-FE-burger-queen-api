const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../services/connection');

const { secret } = config;

/** @module auth */
module.exports = (app, nextMain) => {
  /**
   * @name /auth
   * @description Crea token de autenticación.
   * @path {POST} /auth
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @response {String} token Token a usar para los requests sucesivos
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @auth No requiere autenticación
   */
  app.post('/auth', (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }
    // TODO: autenticar a la usuarix

    db()
      .then((db) => {
        db.collection('users').findOne({ email })
          .then((user) => {
            const payload = { uid: user._id, roles: user.roles.admin };
            if (!user) {
              next(403);
            } else if (!bcrypt.compareSync(password, user.password)) {
              next(401);
            } else {
              resp.send({ message: 'authenticatio successful', token: jwt.sign(payload, secret) });
            }
          });
      });
  });
  return nextMain();
};
