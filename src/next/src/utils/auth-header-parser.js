import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../../utils/jwt';

const AUTH_TYPES = {
  BASIC: 'basic',
  BEARER: 'bearer',
};

export default function authHeaderParser(header) {
  const authArr = header.split(' ');
  if (authArr.length === 1) {
    return {
      type: 'unknown',
      token: authArr[0],
    };
  }
  if (authArr.length === 2) {
    const [type, token] = authArr;
    const typeName = AUTH_TYPES[type.toUpperCase()];
    if (!typeName) {
      return {
        type: 'unknown',
        token,
      };
    }
    if (type.toLowerCase() === AUTH_TYPES.BASIC) {
      const decoded = Buffer.from(token, 'base64').toString('ascii');
      const [login, password] = decoded.split(':');
      return {
        type,
        token,
        payload: {
          login,
          password,
        },
      };
    }
    if (type.toLowerCase() === AUTH_TYPES.BEARER) {
      return jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
          return {
            type,
            token,
          };
        }
        if (decoded) {
          return {
            type,
            token,
            payload: { ...decoded },
          };
        }
        return {
          type,
          token,
        };
      });
    }
  }
  return {};
}
