import userModel from '../models/user.model.js';
import {
  CREATED, USER_NOT_FOUND_TXT, JWT_EXPIRATION_TIMEOUT, LOGIN_SUCCESFUL,
  AUTH_REQUIRED_TXT, LOGGED_OUT,
} from '../utils/constants.js';

import NotFoundError from '../errors/NotFoundError.js';
import UnauthorizedError from '../errors/UnauthorizedError.js';

const User = userModel;

/**
 * Register a user
 * @returns {{ user: { _id: string, name: string, email: string } }} user instance
 */
export async function createUser(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const userEntry = await User.createNew(name, email, password);
    res.status(CREATED).send(userEntry);
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
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    if (!user) throw new NotFoundError(USER_NOT_FOUND_TXT);
    return res.send(user);
  } catch (err) {
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
    return res.send({ name: userEntry.name, email: userEntry.email });
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
    const userEntry = await User.authorize(email, password);
    if (!userEntry) return next(new UnauthorizedError(AUTH_REQUIRED_TXT));
    return res.cookie('auth', userEntry._id, {
      maxAge: JWT_EXPIRATION_TIMEOUT,
      httpOnly: true,
      sameSite: true,
      signed: true,
    })
      .send(userEntry);
  } catch (err) {
    next(err);
  }
  return next();
}

export async function logout(req, res, next) {
  try {
    return res.clearCookie('auth')
      .send({ message: LOGGED_OUT });
  } catch (err) {
    next(err);
  }
  return next();
}
