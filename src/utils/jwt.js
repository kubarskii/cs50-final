import jwt from 'jsonwebtoken';

export const SECRET_KEY = 'some-secret-key';

export const JWT = {
  generateJWTForUser(user) {
    const authToken = jwt.sign(user, SECRET_KEY);
    return authToken;
  },
  decoderJWT(accessToken) {
    const decoded = jwt.verify(accessToken, SECRET_KEY);
    return decoded;
  },
};
