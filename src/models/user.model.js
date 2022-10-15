import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
import bcrypt from 'bcryptjs';

import {
  USER_NAME_MAX_TXT, USER_NAME_MIN_TXT, WRONG_CREDENTIALS_TXT,
  PASSWORD_MIN_TXT, BAD_REQUEST_TXT, SALT_ROUNDS, DB_DUPLICATE_KEY_CODE,
  EMAIL_EXIST_TXT, WRONG_ID_TXT,
  VALIDATION_ERROR, CAST_ERROR_NAME,
} from '../utils/constants.js';

import ForbiddenError from '../errors/ForbiddenError.js';
import BadRequestError from '../errors/BadRequestError.js';
import ConflictError from '../errors/ConflictError.js';
import NotFoundError from '../errors/NotFoundError.js';

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

userSchema.methods.trim = function trim() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

userSchema.statics.createNew = async function createNew(name, email, password) {
  let userEntry;
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    userEntry = await this.create({ name, email, password: hash });
    if (!userEntry) throw new BadRequestError(BAD_REQUEST_TXT);

    return userEntry.trim();
  } catch (err) {
    if (err.name === VALIDATION_ERROR) throw new BadRequestError(BAD_REQUEST_TXT);
    if (err.name === CAST_ERROR_NAME) throw new BadRequestError(WRONG_ID_TXT);
    if (err.code === DB_DUPLICATE_KEY_CODE) throw new ConflictError(EMAIL_EXIST_TXT);

    throw new ForbiddenError(WRONG_CREDENTIALS_TXT);
  }
};

userSchema.statics.authorize = async function authorize(email, password) {
  let userEntry;
  try {
    userEntry = await this.findOne({ email }).select('+password');
    if (!userEntry) throw new NotFoundError(BAD_REQUEST_TXT);

    const match = await bcrypt.compare(password, userEntry.password);
    if (!match) throw new ForbiddenError(WRONG_CREDENTIALS_TXT);

    return userEntry.trim();
  } catch (err) {
    if (err.name === VALIDATION_ERROR) throw new BadRequestError(BAD_REQUEST_TXT);
    if (err.name === CAST_ERROR_NAME) throw new BadRequestError(WRONG_ID_TXT);

    throw new ForbiddenError(WRONG_CREDENTIALS_TXT);
  }
};

export default mongoose.model('user', userSchema);
