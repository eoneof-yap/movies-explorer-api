import userModel from '../models/user.model.js';

import NotFoundError from '../errors/NotFoundError.js';

import {
  CREATED, JWT_EXPIRATION_TIMEOUT, LOGIN_SUCCESFUL, USER_NOT_FOUND_TXT,
} from '../utils/constants.js';

import { validationErrorHandler, objectIdErrorHanler } from '../utils/utils.js';
import BadRequestError from '../errors/BadRequestError.js';

const User = userModel;

/**
 * Register a user
 * @returns {{ user: { _id: string, name: string, email: string } }} user instance
 */
export async function createUser(req, res, next) {
  const { name, email, password } = req.body;
  try {
    const userEntry = await User.createNew({ name, email, password });
    res.status(CREATED).send(userEntry);
  } catch (err) {
    next(err);
  }
  return next();
}

/**
 * Get current user info
 * @returns {{ user: { _id: string, name: string, email: string } }} user instanc
 */
export async function getUser(req, res, next) {
  const { id } = req.body;
  try {
    const userEntry = await User.findById(id);
    if (!userEntry) return next(new BadRequestError(USER_NOT_FOUND_TXT));

    return res.send(userEntry);
  } catch (err) {
    validationErrorHandler(err, next);
    objectIdErrorHanler(err, next);
    next(err);
  }
  return next();
}

/**
 * Update user info
 * @returns {{ user: { name: string, email: string } }} user instance
 */
export async function updateUser(req, res, next) {
  const { id, name, email } = req.body;
  try {
    const userEntry = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true },
    );
    if (!userEntry) return next(new NotFoundError(USER_NOT_FOUND_TXT));

    return res.send({ name: userEntry.name, email: userEntry.email });
  } catch (err) {
    validationErrorHandler(err, next);
    objectIdErrorHanler(err, next);
    next(err);
  }
  return next();
}

/**
 * Verify pasword and set cookies response header
 * @returns { { message: success string, res: { headers: {'set-cookies': string }} } signed cookie
 */
export async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.authorize(email, password);
    return res.cookie('jwt', user._id, {
      maxAge: JWT_EXPIRATION_TIMEOUT,
      httpOnly: true,
      sameSite: true,
      signed: true,
    })
      .send({ message: LOGIN_SUCCESFUL });
  } catch (err) {
    next(err);
  }
  return next();
}
