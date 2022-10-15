import userModel from '../models/user.model.js';
import {
  CREATED, USER_NOT_FOUND_TXT, JWT_EXPIRATION_TIMEOUT, LOGGED_OUT,
  WRONG_CREDENTIALS_TXT, BAD_REQUEST_TXT,
  CAST_ERROR_NAME,
} from '../utils/constants.js';

import NotFoundError from '../errors/NotFoundError.js';
import UnauthorizedError from '../errors/UnauthorizedError.js';
import BadRequestError from '../errors/BadRequestError.js';

const User = userModel;

/**
 * Register a user
 * @returns {{ user: { _id: string, name: string, email: string } }} user instance
 */
export async function createUser(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const userEntry = await User.createEntry(name, email, password);
    if (!userEntry) next(new BadRequestError(BAD_REQUEST_TXT));

    return res.status(CREATED).send(userEntry);
  } catch (err) {
    next(err);
  }
  return next();
}

/**
 * Get current user info
 * @returns {{ user: { _id: string, name: string, email: string } }} user instance
 */
export async function getUser(req, res, next) {
  let userEntry;
  try {
    const { user } = req.cookies;
    userEntry = await User.findById(user._id);

    return res.send(userEntry.trim());
  } catch (err) {
    if (!userEntry) next(new NotFoundError(USER_NOT_FOUND_TXT));
    if (err.name === CAST_ERROR_NAME) next(new NotFoundError(USER_NOT_FOUND_TXT));
    next(err);
  }
  return next();
}

/**
 * Update user info
 * @returns {{ user: { name: string, email: string } }} user instance
 */
export async function updateUser(req, res, next) {
  try {
    const { id, name, email } = req.body;
    const userEntry = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true },
    );
    if (!userEntry) return next(new NotFoundError(USER_NOT_FOUND_TXT));

    return res.send(userEntry.trim());
  } catch (err) {
    next(err);
  }
  return next();
}

/**
 * Verify pasword and set cookies response header
 * @returns { { message: success string, res: { headers: {'set-cookies': string }} } signed cookie
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // custom method
    const userEntry = await User.authorize(email, password);
    if (!userEntry) {
      // clear cookies if any
      res.clearCookie('auth').clearCookie('user');
      return next(new UnauthorizedError(WRONG_CREDENTIALS_TXT));
    }
    return res.cookie('auth', userEntry._id, {
      maxAge: JWT_EXPIRATION_TIMEOUT,
      httpOnly: true,
      sameSite: true,
      signed: true,
    })
      .cookie('user', userEntry, {
        maxAge: JWT_EXPIRATION_TIMEOUT,
        httpOnly: true,
        sameSite: true,
        signed: false,
      })
      .send(userEntry);
  } catch (err) {
    next(err);
  }
  return next();
}

export async function logout(req, res, next) {
  try {
    return res.clearCookie('auth').clearCookie('user')
      .send({ message: LOGGED_OUT });
  } catch (err) {
    next(err);
  }
  return next();
}
