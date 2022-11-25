import URL from 'url';
import { DEFAULT_HEADERS } from '../../constants';
import { getBody } from '../utils/getBody';
import authHeaderParser from '../utils/auth-header-parser';
import { checkHeader } from './room.controller';
import User from '../models/user';
import db from '../utils/db';
import { JWT } from '../utils/jwt';
import { validateSchema } from '../utils/schema-validator';
import { checkValid, createHash } from '../db/hash';

const userSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    surname: {
      type: 'string',
    },
    login: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
  },
  required: ['name', 'surname', 'login', 'password', 'email'],
};

export const user = new User(db);
export const UserController = {
  async login(req, res) {
    const auth = req.headers.authorization;
    const { type, payload: { login, password } } = authHeaderParser(auth);
    if (type.toLowerCase() === 'basic' && login && password) {
      const { salt, password: encrypted } = await user.getByLogin(login) || {};
      if (!salt) {
        res.writeHead(401, 'Unknown user', DEFAULT_HEADERS);
        res.end();
        return;
      }
      const isPasswordValid = await checkValid(password, salt, encrypted);
      if (isPasswordValid) {
        const userData = await user.login(login, encrypted);
        const accessToken = JWT.generateJWTForUser(userData);
        res.writeHead(200, DEFAULT_HEADERS);
        res.write(Buffer.from(JSON.stringify({ accessToken })));
        res.end();
        return;
      }
    }
    res.writeHead(401, 'Unknown user', DEFAULT_HEADERS);
    res.end();
  },
  async register(req, res) {
    try {
      const body = await getBody(req);
      const [isValid, errorMessage] = validateSchema(userSchema)(body);
      if (!isValid) {
        res.writeHead(400, DEFAULT_HEADERS);
        res.write(Buffer.from(JSON.stringify({ error: errorMessage })));
        res.end();
        return;
      }
      const userDataByLogin = await user.getByLogin(body.login);
      const userDataByEmail = await user.getByEmail(body.email);
      if (userDataByEmail || userDataByLogin) {
        res.writeHead(400, 'User already exists', DEFAULT_HEADERS);
        res.write(Buffer.from(JSON.stringify({ error: 'User already exists' })));
        res.end();
        return;
      }
      const { salt, hash } = await createHash(body.password);
      await user.create({ ...body, password: hash, salt });
      res.writeHead(201, 'User created', DEFAULT_HEADERS);
      res.write(JSON.stringify({ created: true }));
      res.end();
    } catch (e) {
      res.writeHead(500, e.message || 'Unknown Error on POST', DEFAULT_HEADERS);
      res.end();
    }
  },
  /**
     * TODO
     * */
  async forgotPassword(req, res) {
    const body = getBody(req);
    const { email } = body;
    res.writeHead(500, 'Not implemented', DEFAULT_HEADERS);
    res.end();
  },
  /**
     * Used to search users by login, name, surname, email or phone
     * */
  async findUserByInput(req, res) {
    const MIN_QUERY_LENGTH = 2;
    const authHeader = req.headers.authorization;
    checkHeader(req, res, authHeader);
    const { type } = authHeaderParser(authHeader);
    if (type.toLowerCase() !== 'bearer') {
      res.writeHead(400, 'Invalid token', DEFAULT_HEADERS);
      res.end();
    }
    const { query } = URL.parse(req.url, true);
    const { q } = query;
    const decodedQ = decodeURI(q);
    if (!q || decodedQ.length < MIN_QUERY_LENGTH) {
      res.writeHead(200, 'Success', DEFAULT_HEADERS);
      res.write(JSON.stringify({ foundUsers: [] }));
      res.end();
    }
    const foundUsers = await user.findUserFTC(decodedQ);
    res.writeHead(200, 'Success', DEFAULT_HEADERS);
    res.write(JSON.stringify({ foundUsers }));
    res.end();
  },
  async delete(req, res) {
    const authHeader = req.headers.authorization;
    const { type, payload: { id } } = authHeaderParser(authHeader);
    if (type.toLowerCase() !== 'bearer' || !id) {
      res.writeHead(400, 'Invalid token', DEFAULT_HEADERS);
      res.end();
    }
    const userData = await user.getById(id);
    if (userData) await user.delete(id);
  },
};
