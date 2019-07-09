const jwt = require('jsonwebtoken');

const createToken = (user, secret) => {
  const payload = {
    sub: user._id,
    role: user.role.admin,
  };
  return jwt.sign({ payload }, secret);
};

module.exports = createToken;
