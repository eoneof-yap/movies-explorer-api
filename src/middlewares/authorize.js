import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { TOKEN_PREFIX, AUTH_REQUIRED_TXT, TOKEN_EXPIRED_TXT } from '../utils/constants.js';

import UnauthorizedError from '../errors/UnauthorizedError.js';

const JWT_SECRET = process.env.NODE_ENV === 'production'
  ? process.env.JWT_SECRET
  : '123-ABC-XYZ';

dotenv.config();

export default function authorize(err, req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith(TOKEN_PREFIX)) {
    next(new UnauthorizedError(AUTH_REQUIRED_TXT));
  }

  const token = authorization.replace(TOKEN_PREFIX, '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    next(new UnauthorizedError(TOKEN_EXPIRED_TXT));
  }
  req.user = payload;

  next(err);
}
