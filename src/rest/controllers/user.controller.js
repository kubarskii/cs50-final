import User from '../../models/user';
import db from '../../lib/db';
import { JWT } from '../../utils/jwt';
import { DEFAULT_HEADERS, getBody } from '../router';

const user = new User(db);
export const UserController = {
  async login(req, res) {
    const auth = req.headers.authorization;
    const [authType, encoded] = auth.split(' ');
    if (authType.toLowerCase() === 'basic' && encoded) {
      const [login, password] = Buffer
        .from(encoded, 'base64')
        .toString('ascii')
        .split(':');
      const userData = await user.login(login, password);
      if (!userData) {
        res.writeHead(401, 'Unknown user', DEFAULT_HEADERS);
        res.end();
        return;
      }
      const accessToken = JWT.generateJWTForUser(userData);
      res.writeHead(200);
      res.write(Buffer.from(JSON.stringify({ accessToken })));
      res.end();
    }
    res.writeHead(401, 'Unknown user', DEFAULT_HEADERS);
    res.end();
  },
  async register(req, res) {
    try {
      const body = await getBody(req);
      await user.create(body);
      res.writeHead(201, 'User created', DEFAULT_HEADERS);
      res.end();
    } catch (e) {
      res.writeHead(500, e || 'Unknown Error on POST', DEFAULT_HEADERS);
      res.end();
    }
  },
  async delete(req, res) {
    const authHeader = req.headers.authorization;
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer') {
      res.writeHead(400, 'Invalid token', DEFAULT_HEADERS);
      res.end();
    }
    const decoded = JWT.decoderJWT(token);
    const { login, name, surname } = decoded;
    await user.delete();
  },
};
