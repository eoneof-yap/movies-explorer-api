import userModel from '../models/user.model.js';

import NotFoundError from '../errors/NotFoundError.js';
import BadRequestError from '../errors/BadRequestError.js';

import {
  WRONG_ID_TXT, CREATED, USER_NOT_FOUND_TXT,
  VALIDATION_ERROR, CAST_ERROR, BAD_REQUEST_TXT,
} from '../utils/constants.js';

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
    if (err.name === VALIDATION_ERROR) return next(new BadRequestError(BAD_REQUEST_TXT));
    if (err.name === CAST_ERROR) return next(new BadRequestError(WRONG_ID_TXT));
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
    if (err.name === VALIDATION_ERROR) return next(new BadRequestError(BAD_REQUEST_TXT));
    if (err.name === CAST_ERROR) { return next(new BadRequestError(WRONG_ID_TXT)); }
    next(err);
  }
  return next();
}

/**
 * Login
 * @returns {{ token: string }} JWT token
 */
export async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const token = await User.authorize(email, password); // TODO: save JWT to cookie
    return res.send({ token });
  } catch (err) {
    next(err);
  }
  return next();
}
