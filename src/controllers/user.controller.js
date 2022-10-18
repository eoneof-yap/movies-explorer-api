import userModel from '../models/user.model.js';
import {
  CREATED, USER_NOT_FOUND_TXT, JWT_EXPIRATION_TIMEOUT, LOGGED_OUT,
  BAD_REQUEST_TXT, SIGNUP_SUCCESSFUL,
  CAST_ERROR_NAME, EMAIL_EXIST_TXT, WRONG_CREDENTIALS_TXT,
} from '../utils/constants.js';

import NotFoundError from '../errors/NotFoundError.js';
import BadRequestError from '../errors/BadRequestError.js';
import ConflictError from '../errors/ConflictError.js';
import UnauthorizedError from '../errors/UnauthorizedError.js';

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
    return next(err);
  }
}

/**
 * Get current user info
 * @returns {{ user: { _id: string, name: string, email: string } }} user instance
 */
export async function getUser(req, res, next) {
  let userEntry;
  try {
    const { user } = req;
    userEntry = await User.findById(user._id);
    if (!userEntry) throw new NotFoundError(USER_NOT_FOUND_TXT);
    return res.send(userEntry.trim());
  } catch (err) {
    if (err.name === CAST_ERROR_NAME) return next(new BadRequestError(BAD_REQUEST_TXT));
    return next(err);
  }
}

/**
 * Update user info
 * @returns {{ user: { name: string, email: string } }} user instance
 */
export async function updateUser(req, res, next) {
  let userEntry;
  try {
    const { user } = req;
    const { name, email } = req.body;

    userEntry = await User.findOne({ email });
    if (!userEntry) {
      userEntry = await User.findByIdAndUpdate(
        user._id,
        { name, email },
        { new: true, runValidators: true },
      );
      if (!userEntry) throw new NotFoundError(USER_NOT_FOUND_TXT);
    }
    if (userEntry.id !== user._id) throw new ConflictError(EMAIL_EXIST_TXT);
    return res.send(userEntry.trim());
  } catch (err) {
    return next(err);
  }
}

/**
 * Verify pasword and set cookies response header
 * @returns { { message: success string, res: { headers: {'set-cookies': string }} } signed cookie
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // custom method
    const { token, userEntry } = await User.authorize(email, password);
    if (!token || !userEntry) throw new UnauthorizedError(WRONG_CREDENTIALS_TXT);
    return res.cookie('auth', token, {
      maxAge: JWT_EXPIRATION_TIMEOUT,
      httpOnly: true,
      sameSite: true,
      signed: true,
    }).send(userEntry);
  } catch (err) {
    return next(err);
  }
}

export async function logout(req, res, next) {
  try {
    return res.clearCookie('auth').send({ message: LOGGED_OUT });
  } catch (err) {
    return next(err);
  }
}
