import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
import bcrypt from 'bcryptjs';

import { USER_NAME_MAX_TXT, USER_NAME_MIN_TXT, WRONG_CREDENTIALS_TXT } from '../utils/constants.js';

import UnauthorizedError from '../errors/NotFoundError.js';

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

userSchema.methods.trim = () => {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

userSchema.statics.findUserByCredentials = async function checkCreds(email, password) {
  const user = await this.findOne({ email }).orFail(() => {
    throw new UnauthorizedError(WRONG_CREDENTIALS_TXT);
  }).select('+password');
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new UnauthorizedError(WRONG_CREDENTIALS_TXT);
  }
  return user;
};

export default mongoose.model('user', userSchema);
