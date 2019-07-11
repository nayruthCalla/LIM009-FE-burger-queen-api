const bcrypt = require('bcrypt');
const config = require('../config');
const db = require('../services/connection');
const tokens = require('../services/tokens');

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
      return (400);
    }
    // TODO: autenticar a la usuarix
    db()
      .then((db) => {
        const query = { email };
        db.collection('users').findOne(query).then((user) => {
          if (!user) {
            resp.send({ message: 'authentication failed. User not found' });
            next(404);
          } else if (!bcrypt.compareSync(password, user.password)) {
            resp.send({ message: 'authentication failed. Wrong password' });
            next(401);
          } else {
            const token = tokens(user, secret);
            resp.send({ message: 'authenticatio successful', token });
            next();
          }
        });
      })
      .catch((err) => {
        console.info(err);
      });
  });
  return nextMain();
};
