const jwt = require('jsonwebtoken');
const moment = require('moment');

const createToken = (user, secret) => {
  const payload = {
    sub: user._id,
    email: user.email,
    iat: moment().unix(),
  };
  return jwt.sign({ payload }, secret);
};
module.exports = createToken;
