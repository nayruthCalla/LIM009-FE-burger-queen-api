const config = require('../config');
const db = require('../services/connection');
const { dbUrl } = require('../config');
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
   * @code {401} si cabecera de autenticación no está presente
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @auth No requiere autenticación
   */
  app.post('/auth', (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }
    // TODO: autenticar a la usuarix
    db(dbUrl)
      .then((db) => {
        const query = { email };
        db.collection('users').findOne(query).then((user) => {
          if (!user) {
            resp.send({ success: true, message: 'authentication failed. User not found' });
          } else if (user) {
            if (user.password !== password) {
              resp.json({ success: false, message: 'authentication failed. Wrong password' });
            } else {
              const token = tokens(user, secret);
              resp.json({ success: true, message: 'Enjoy your token', token });
              return next();
            }
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  return nextMain();
};
