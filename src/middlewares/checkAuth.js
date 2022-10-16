import { AUTH_REQUIRED_TXT } from '../utils/constants.js';

import UnauthorizedError from '../errors/UnauthorizedError.js';

/**
 * Validate token and change request header
 */
export default async function checkAuth(req, res, next) {
  try {
    const { auth } = req.signedCookies;
    if (!auth) throw new UnauthorizedError(AUTH_REQUIRED_TXT);
    return next();
  } catch (err) {
    next(err);
  }
  return next();
}
