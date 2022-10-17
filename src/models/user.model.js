import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
import bcrypt from 'bcryptjs';

import {
  USER_NAME_MAX_TXT, USER_NAME_MIN_TXT, WRONG_CREDENTIALS_TXT, SALT_ROUNDS,
  EMAIL_EXIST_TXT, DB_DUPLICATE_KEY_CODE,
} from '../utils/constants.js';

import ForbiddenError from '../errors/ForbiddenError.js';
import ConflictError from '../errors/ConflictError.js';

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
    throw new ForbiddenError(WRONG_CREDENTIALS_TXT);
  }
};

userSchema.statics.authorize = async function authorize(email, password) {
  let userEntry;
  try {
    userEntry = await this.findOne({ email }).select('+password');
    if (!userEntry) return null;

    const match = await bcrypt.compare(password, userEntry.password);
    if (!match) return null;

    return userEntry.trim();
  } catch (err) {
    throw new ForbiddenError(WRONG_CREDENTIALS_TXT);
  }
};

export default mongoose.model('user', userSchema);
