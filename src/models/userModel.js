import dotenv from 'dotenv';
import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
  USER_NAME_MAX_TXT, USER_NAME_MIN_TXT, WRONG_CREDENTIALS_TXT,
  PASSWORD_MIN_TXT, BAD_REQUEST_TXT, SALT_ROUNDS, DB_DUPLICATE_KEY_CODE,
  EMAIL_EXIST_TXT, JWT_EXPIRATION_TIMEOUT,
} from '../utils/constants.js';

import ForbiddenError from '../errors/ForbiddenError.js';
import BadRequestError from '../errors/BadRequestError.js';
import ConflictError from '../errors/ConflictError.js';
import { validationErrorHandler } from '../utils/utils.js';
import NotFoundError from '../errors/NotFoundError.js';

const JWT_SECRET = process.env.NODE_ENV === 'production'
  ? process.env.JWT_SECRET
  : '123-ABC-XYZ';

dotenv.config();

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
    minlength: [8, PASSWORD_MIN_TXT],
  },
  name: {
    type: String,
    required: true,
    minlength: [2, USER_NAME_MIN_TXT],
    maxlength: [30, USER_NAME_MAX_TXT],
  },
});

userSchema.statics.createNew = async function createNew({ name, email, password }) {
  let user;
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    user = await this.create({ name, email, password: hash });
    if (!user) throw new BadRequestError(BAD_REQUEST_TXT);

    user = user.toObject();
    delete user.password;
    delete user.__v;
  } catch (err) {
    validationErrorHandler(err);
    if (err.code === DB_DUPLICATE_KEY_CODE) { // mongo err
      throw new ConflictError(EMAIL_EXIST_TXT);
    }
  }
  return user;
};

userSchema.statics.authorize = async function authorize(email, password) {
  // let token;
  try {
    const user = await this.findOne({ email }).select('+password');
    // if (!user) throw new NotFoundError(BAD_REQUEST_TXT);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new ForbiddenError(WRONG_CREDENTIALS_TXT);

    // token = await jwt.sign({ _id: user._id }, JWT_SECRET, {
    //   expiresIn: JWT_EXPIRATION_TIMEOUT,
    // });
    // if (!token) throw new ForbiddenError(WRONG_CREDENTIALS_TXT);
    return user.id;
  } catch (err) {
    validationErrorHandler(err);
    throw new ForbiddenError(WRONG_CREDENTIALS_TXT);
  }
};

export default mongoose.model('user', userSchema);
