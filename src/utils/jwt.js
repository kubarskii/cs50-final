import jwt from 'jsonwebtoken';

const SECRET_KEY = 'some-secret-key';

export const JWT = {
  async generateJWTForUser(user) {
    const authToken = jwt.sign(user, SECRET_KEY);
    return authToken;
  },
  async decoderJWT(accessToken) {
    const decoded = jwt.verify(accessToken, SECRET_KEY);
    return decoded;
  },
};
