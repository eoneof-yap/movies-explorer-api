import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import userModel from '../models/userModel.js';

import ConflictError from '../errors/ConflictError.js';
import BadRequestError from '../errors/BadRequestError.js';

import {
  CREATED, SALT_ROUNDS, DB_DUPLICATE_KEY_CODE, JWT_EXPIRATION_TIMEOUT,
  EMAIL_EXIST_TXT, BAD_REQUEST_TXT,
} from '../utils/constants.js';

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
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, password: hash });
    res.status(CREATED).send(user); // TODO: hide password and '__v'
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(`${BAD_REQUEST_TXT}: ${err.errors.name}`));
      return;
    }

    if (err.code === DB_DUPLICATE_KEY_CODE) {
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
      res.status(404).send({ message: '404' });
    });
    res.send(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      res.status(400).send({ error: err });
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
      res.status(404).send({ message: '404' });
    });
    res.send(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      res.status(400).send({ error: err });
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
    const user = await User.findUserByCredentials(email, password);
    const token = await jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION_TIMEOUT,
    });

    res.send({ token });
  } catch (err) {
    next(err);
  }
}
