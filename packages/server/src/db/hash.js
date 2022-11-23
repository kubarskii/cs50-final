import crypto from 'crypto';
import util from 'util';

const pbkdf2 = util.promisify(crypto.pbkdf2);

export async function createHash(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = await pbkdf2(password, salt, 1000, 64, 'sha512');
  return { salt, hash: hash.toString('hex') };
}

export async function checkValid(password, salt, encrypted) {
  const hash = await pbkdf2(password, salt, 1000, 64, 'sha512');
  return hash.toString('hex') === encrypted;
}
