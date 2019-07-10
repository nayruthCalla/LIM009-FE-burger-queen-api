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
            resp.status(404).send({ message: 'authentication failed. User not found' });
          } else if (!bcrypt.compareSync(password, user.password)) {
            resp.status(401).send({ message: 'authentication failed. Wrong password' });
          } else {
            const token = tokens(user, secret);
            resp.status(200).send({ message: 'authenticatio successful', token });
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  return nextMain();
};
