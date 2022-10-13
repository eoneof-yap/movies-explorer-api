import dotenv from 'dotenv';
import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
import bcrypt from 'bcryptjs';

import {
  USER_NAME_MAX_TXT, USER_NAME_MIN_TXT, WRONG_CREDENTIALS_TXT,
  PASSWORD_MIN_TXT, BAD_REQUEST_TXT,
} from '../utils/constants.js';

import ForbiddenError from '../errors/ForbiddenError.js';
import NotFoundError from '../errors/NotFoundError.js';
import { validationErrorHandler } from '../utils/utils.js';

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

userSchema.statics.authorize = async function authorize(email, password) {
  // let token;
  try {
    const user = await this.findOne({ email }).select('+password');
    if (!user) throw new NotFoundError(BAD_REQUEST_TXT);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new ForbiddenError(WRONG_CREDENTIALS_TXT);

    return user;
  } catch (err) {
    validationErrorHandler(err);
    throw new ForbiddenError(WRONG_CREDENTIALS_TXT);
  }
};

export default mongoose.model('user', userSchema);
