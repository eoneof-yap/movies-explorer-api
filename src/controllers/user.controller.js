import userModel from '../models/user.model.js';
import {
  CREATED, USER_NOT_FOUND_TXT, KEY_EXPIRATION_TIMEOUT, LOGGED_OUT,
  WRONG_CREDENTIALS_TXT, BAD_REQUEST_TXT, SIGNUP_SUCCESSFUL,
  CAST_ERROR_NAME, EMAIL_EXIST_TXT,
} from '../utils/constants.js';

import NotFoundError from '../errors/NotFoundError.js';
import UnauthorizedError from '../errors/UnauthorizedError.js';
import BadRequestError from '../errors/BadRequestError.js';
import ConflictError from '../errors/ConflictError.js';

const User = userModel;

/**
 * Register a user
 * @returns {{ user: { _id: string, name: string, email: string } }} user instance
 */
export async function createUser(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const userEntry = await User.createEntry(name, email, password);
    if (!userEntry) throw new BadRequestError(BAD_REQUEST_TXT);
    return res.status(CREATED).send({ message: SIGNUP_SUCCESSFUL });
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
    if (!userEntry) throw new NotFoundError(USER_NOT_FOUND_TXT);
    return res.send(userEntry.trim());
  } catch (err) {
    if (err.name === CAST_ERROR_NAME) next(new BadRequestError(BAD_REQUEST_TXT));
    next(err);
  }
  return next();
}

/**
 * Update user info
 * @returns {{ user: { name: string, email: string } }} user instance
 */
export async function updateUser(req, res, next) {
  let userEntry;
  try {
    const { user } = req.cookies;
    const { name, email } = req.body;

    userEntry = await User.findOne({ email });
    if (userEntry.id !== user._id) throw new ConflictError(EMAIL_EXIST_TXT);

    userEntry = await User.findByIdAndUpdate(
      user._id,
      { name, email },
      { new: true, runValidators: true },
    );
    if (!userEntry) throw new NotFoundError(USER_NOT_FOUND_TXT);
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
      res.clearCookie('auth').clearCookie('user'); // clear cookies if any
      throw new UnauthorizedError(WRONG_CREDENTIALS_TXT);
    }
    return res.cookie('auth', userEntry._id, {
      maxAge: KEY_EXPIRATION_TIMEOUT,
      httpOnly: true,
      sameSite: true,
      signed: true,
    })
      .cookie('user', userEntry, {
        maxAge: KEY_EXPIRATION_TIMEOUT,
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
