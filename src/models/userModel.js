import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
import bcrypt from 'bcryptjs';

import {
  USER_NAME_MAX_TXT, USER_NAME_MIN_TXT, WRONG_CREDENTIALS_TXT, PASSWORD_MIN_TXT,
} from '../utils/constants.js';

import UnauthorizedError from '../errors/UnauthorizedError.js';
import ForbiddenError from '../errors/ForbiddenError.js';

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

userSchema.statics.findUserByCredentials = async function checkCreds(email, password) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) {
    throw new ForbiddenError(WRONG_CREDENTIALS_TXT);
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new UnauthorizedError(WRONG_CREDENTIALS_TXT);
  }
  return user;
};

export default mongoose.model('user', userSchema);
