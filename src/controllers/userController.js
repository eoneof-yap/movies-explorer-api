import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import userModel from '../models/userModel.js';

import ConflictError from '../errors/ConflictError.js';
import BadRequestError from '../errors/BadRequestError.js';
import NotFoundError from '../errors/NotFoundError.js';
import UnauthorizedError from '../errors/UnauthorizedError.js';

import {
  CREATED, DB_DUPLICATE_KEY_CODE, JWT_EXPIRATION_TIMEOUT,
  EMAIL_EXIST_TXT, BAD_REQUEST_TXT, USER_NOT_FOUND_TXT, AUTH_REQUIRED_TXT,
} from '../utils/constants.js';

import validationerrHandler from '../utils/utils.js';

dotenv.config();

const User = userModel;

const JWT_SECRET = process.env.NODE_ENV === 'production'
  ? process.env.JWT_SECRET
  : '123-ABC-XYZ';

/**
 * Register a user
 * @returns {{ user: { _id: string, name: string, email: string } }} user instance
 */
export async function createUser(req, res, next) {
  const { name, email, password } = req.body;
  try {
    const user = await User.createNew({ name, email, password });
    res.status(CREATED).send(user);
  } catch (err) {
    validationerrHandler(err, next);

    if (err.code === DB_DUPLICATE_KEY_CODE) { // mongo err
      next(new ConflictError(EMAIL_EXIST_TXT));
      return;
    }
    next(err);
  }
}

/**
 * Get current user info
 * @returns {{ user: { _id: string, name: string, email: string } }} user instance
 */
export async function getUser(req, res, next) {
  const { id } = req.body;
  try {
    const user = await User.findById(id).orFail(() => {
      next(new UnauthorizedError(AUTH_REQUIRED_TXT));
    });

    res.send(user);
  } catch (err) {
    validationerrHandler(err, next);

    if (err.kind === 'ObjectId') {
      next(new BadRequestError(BAD_REQUEST_TXT));
      return;
    }
    next(err);
  }
}

/**
 * Update user info
 * @returns {{ user: { name: string, email: string } }} user instance
 */
export async function updateUser(req, res, next) {
  const { id, name, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true },
    ).orFail(() => {
      next(new NotFoundError(USER_NOT_FOUND_TXT));
    });

    res.send({ name: user.name, email: user.email });
  } catch (err) {
    validationerrHandler(err, next);

    if (err.kind === 'ObjectId') {
      next(new BadRequestError(BAD_REQUEST_TXT));
      return;
    }
    next(err);
  }
}

/**
 * Login
 * @returns {{ token: string }} JWT token
 */
export async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    // TODO: save JWT to cookie
    const user = await User.authorize(email, password);
    if (!user) {
      next(new BadRequestError(BAD_REQUEST_TXT));
      return;
    }
    const token = await jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION_TIMEOUT,
    });

    res.send({ token });
  } catch (err) {
    validationerrHandler(err, next);

    next(err);
  }
}
