import dotenv from 'dotenv';
import process from 'process';
import jwt from 'jsonwebtoken';

import { TOKEN_PREFIX, AUTH_REQUIRED_TXT } from '../utils/constants.js';

import UnauthorizedError from '../errors/UnauthorizedError.js';

dotenv.config();

// const { NODE_ENV = 'production', JWT_SECRET = '123-ABC-XYZ' } = process.env;

// /**
//  * Validate token and change request header
//  * @returns {{ req: { user: { _id: string, exp: number, iat: number }} }} payload
//  */
// export default function validateToken(req, res, next) {
//   const { authorization } = req.headers;
//   let payload;
//   try {
//     if (!authorization || !authorization.startsWith(TOKEN_PREFIX)) {
//       return next(new UnauthorizedError(AUTH_REQUIRED_TXT));
//     }
//     const token = authorization.replace(TOKEN_PREFIX, '');
//     if (!token) return next(new UnauthorizedError(AUTH_REQUIRED_TXT));

//     payload = jwt.verify(token, JWT_SECRET);
//     req.user = payload;
//   } catch (err) {
//     next(err);
//   }
//   return next();
// }

/**
 * Validate token and change request header
 * @returns {{ req: { user: { _id: string, exp: number, iat: number }} }} payload
 */
export default function validateCookie(err, req, res, next) {
  let { auth } = req.signedCookies;
  let payload;
  try {
    if (!auth) {
      auth = req.headers.authorization;
      if (!auth || !auth.startsWith(TOKEN_PREFIX)) {
        return new UnauthorizedError(AUTH_REQUIRED_TXT);
      }
      const token = auth.replace(TOKEN_PREFIX, '');
      if (!token) return new UnauthorizedError(AUTH_REQUIRED_TXT);

      payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
    }
    return next(err);
  } catch (err) {
    next(err);
  }
  return next(err);
}
