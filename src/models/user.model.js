import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
import bcrypt from 'bcryptjs';

import {
  USER_NAME_MAX_TXT, USER_NAME_MIN_TXT, SALT_ROUNDS, VALIDATION_ERROR,
  EMAIL_EXIST_TXT, DB_DUPLICATE_KEY_CODE, CAST_ERROR_NAME, BAD_REQUEST_TXT,
  runtimeKey, JWT_EXPIRATION_TIMEOUT, WRONG_CREDENTIALS_TXT,
} from '../utils/constants.js';

import BadRequestError from '../errors/BadRequestError.js';
import ConflictError from '../errors/ConflictError.js';
import UnauthorizedError from '../errors/UnauthorizedError.js';

dotenv.config();

const { JWT_SECRET = runtimeKey } = process.env;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => isEmail(email),
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: [2, USER_NAME_MIN_TXT],
    maxlength: [30, USER_NAME_MAX_TXT],
  },
});

userSchema.methods.trim = function trim() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

userSchema.statics.createEntry = async function createEntry(name, email, password) {
  let userEntry;
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    userEntry = await this.create({ name, email, password: hash });
    if (!userEntry) return null;

    return userEntry.trim();
  } catch (err) {
    if (err.code === DB_DUPLICATE_KEY_CODE) throw new ConflictError(EMAIL_EXIST_TXT);
    if (err.name === CAST_ERROR_NAME) throw new BadRequestError(BAD_REQUEST_TXT);

    if (err.name === VALIDATION_ERROR) throw new BadRequestError(BAD_REQUEST_TXT);
    throw new Error(err);
  }
};

userSchema.statics.authorize = async function authorize(email, password) {
  let userEntry;
  try {
    userEntry = await this.findOne({ email }).select('+password');
    if (!userEntry) return { token: null, userEntry: null };

    const match = await bcrypt.compare(password, userEntry.password);
    if (!match) return { token: null, userEntry: null };

    const token = jwt.sign({ _id: userEntry._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION_TIMEOUT,
    });
    if (!token) throw new UnauthorizedError(WRONG_CREDENTIALS_TXT);

    return { token, userEntry: userEntry.trim() };
  } catch (err) {
    if (err.name === CAST_ERROR_NAME) throw new BadRequestError(BAD_REQUEST_TXT);
    if (err.name === VALIDATION_ERROR) throw new BadRequestError(BAD_REQUEST_TXT);
    throw new Error(err);
  }
};

export default mongoose.model('user', userSchema);
