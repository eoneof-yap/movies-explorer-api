import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { AUTH_REQUIRED_TXT, runtimeKey } from '../utils/constants.js';

import UnauthorizedError from '../errors/UnauthorizedError.js';

dotenv.config();

const { JWT_SECRET = runtimeKey } = process.env;

/**
 * Validate token and change request header
 */
export default async function checkAuth(req, res, next) {
  try {
    const { auth } = req.signedCookies;
    if (!auth) throw new UnauthorizedError(AUTH_REQUIRED_TXT);

    const payload = jwt.verify(auth, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return next(err);
  }
}
