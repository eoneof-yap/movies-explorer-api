import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
import bcrypt from 'bcryptjs';

import {
  USER_NAME_MAX_TXT, USER_NAME_MIN_TXT, WRONG_CREDENTIALS_TXT,
  PASSWORD_MIN_TXT, BAD_REQUEST_TXT, SALT_ROUNDS,
} from '../utils/constants.js';

import ForbiddenError from '../errors/ForbiddenError.js';
import BadRequestError from '../errors/BadRequestError.js';

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

userSchema.statics.createNew = async function checkCreds({ name, email, password }) {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  let user = await this.create({ name, email, password: hash });
  if (!user) throw new BadRequestError(BAD_REQUEST_TXT);

  user = user.toObject();
  delete user.password;
  delete user.__v;

  return user;
};

userSchema.statics.authorize = async function checkCreds(email, password) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) { throw new ForbiddenError(WRONG_CREDENTIALS_TXT); }

  const match = await bcrypt.compare(password, user.password);
  if (!match) { throw new ForbiddenError(WRONG_CREDENTIALS_TXT); }

  return user;
};

export default mongoose.model('user', userSchema);
