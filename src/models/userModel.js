import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import { USER_NAME_MAX_TXT, USER_NAME_MIN_TXT } from '../utils/constants.js';

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
    min: [2, USER_NAME_MIN_TXT],
    max: [30, USER_NAME_MAX_TXT],
  },
});

// TODO: add static methods

export default mongoose.model('user', userSchema);