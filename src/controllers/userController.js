import bcrypt from 'bcryptjs';
import userModel from '../models/user.model.js';

import NotFoundError from '../errors/NotFoundError.js';

import {
  CREATED, JWT_EXPIRATION_TIMEOUT, SALT_ROUNDS, LOGIN_SUCCESFUL, USER_NOT_FOUND_TXT,
  DB_DUPLICATE_KEY_CODE, EMAIL_EXIST_TXT, BAD_REQUEST_TXT,
} from '../utils/constants.js';

import { validationErrorHandler, objectIdErrorHanler } from '../utils/utils.js';
import BadRequestError from '../errors/BadRequestError.js';
import ConflictError from '../errors/ConflictError.js';

const User = userModel;

/**
 * Register a user
 * @returns {{ user: { _id: string, name: string, email: string } }} user instance
 */
export async function createUser(err, req, res, next) {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    let userEntry = await User.create({ name, email, password: hash });
    if (!userEntry) return new BadRequestError(BAD_REQUEST_TXT);

    userEntry = userEntry.toObject();
    delete userEntry.password;
    delete userEntry.__v;
    return res.status(CREATED).send(userEntry);
  } catch (err) {
    if (err.name === 'ValidatorError') {
      next(new BadRequestError(BAD_REQUEST_TXT));
    }
    if (err.code === DB_DUPLICATE_KEY_CODE) { // mongo err
      throw new ConflictError(EMAIL_EXIST_TXT);
    }
    next(err);
  }
  return next();
}

/**
 * Get current user info
 * @returns {{ user: { _id: string, name: string, email: string } }} user instanc
 */
export async function getUser(req, res, next) {
  try {
    const { id } = req.body;
    const userEntry = await User.findById(id);
    if (!userEntry) return next(new BadRequestError(USER_NOT_FOUND_TXT));

    return res.send(userEntry);
  } catch (err) {
    validationErrorHandler(err);
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
    validationErrorHandler(err);
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
  try {
    const { email, password } = req.body;
    const user = await User.authorize(email, password);
    return res.cookie('auth', user._id, {
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
