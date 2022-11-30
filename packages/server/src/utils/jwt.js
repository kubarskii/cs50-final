const jwt = require('jsonwebtoken');

const SECRET_KEY = 'some-secret-key';

const JWT = {
  generateJWTForUser(user) {
    const authToken = jwt.sign(user, SECRET_KEY);
    return authToken;
  },
  decoderJWT(accessToken) {
    const decoded = jwt.verify(accessToken, SECRET_KEY);
    return decoded;
  },
};

module.exports = {
  JWT,
  SECRET_KEY,
};
