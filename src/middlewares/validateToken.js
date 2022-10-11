import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import {
  TOKEN_PREFIX, AUTH_REQUIRED_TXT,
} from '../utils/constants.js';

import UnauthorizedError from '../errors/UnauthorizedError.js';

dotenv.config();

const JWT_SECRET = process.env.NODE_ENV === 'production'
  ? process.env.JWT_SECRET
  : '123-ABC-XYZ';

/**
 * Validate token and change request header
 * @returns {{ req: { user: { _id: string, exp: number, iat: number }} }} payload
 */
export default function validateToken(req, res, next) {
  const { authorization } = req.headers;
  let payload;
  try {
    if (!authorization || !authorization.startsWith(TOKEN_PREFIX)) {
      return next(new UnauthorizedError(AUTH_REQUIRED_TXT));
    }
    const token = authorization.replace(TOKEN_PREFIX, '');
    if (!token) return next(new UnauthorizedError(AUTH_REQUIRED_TXT));

    payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
  } catch (err) {
    next(err);
  }
  return next();
}
