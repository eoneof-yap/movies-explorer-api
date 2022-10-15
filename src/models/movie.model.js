import mongoose from 'mongoose';
import isURL from 'validator/lib/isURL.js';

import {
  VALIDATION_ERROR, CAST_ERROR_NAME, WRONG_ID_TXT, BAD_REQUEST_TXT,

} from '../utils/constants.js';

import BadRequestError from '../errors/BadRequestError.js';

const movieSchema = new mongoose.Schema({
  movieId: {
    required: true,
    type: String,
  },
  country: {
    required: true,
    type: String,
  },
  director: {
    required: true,
    type: String,
  },
  duration: {
    required: true,
    type: Number,
  },
  year: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  image: {
    required: true,
    type: String,
    validate: {
      validator: (image) => isURL(image),
    },
  },
  trailerLink: {
    required: true,
    type: String,
    validate: {
      validator: (image) => isURL(image),
    },
  },
  thumbnail: {
    required: true,
    type: String,
    validate: {
      validator: (image) => isURL(image),
    },
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  nameRU: {
    required: true,
    type: String,
  },
  nameEN: {
    required: true,
    type: String,
  },
});

movieSchema.statics.createEntry = async function createEntry({ owner, ...movieProps }) {
  let movieEntry;
  try {
    movieEntry = await this.create({ owner, ...movieProps });
    if (!movieEntry) throw new BadRequestError(BAD_REQUEST_TXT);
  } catch (err) {
    if (err.name === VALIDATION_ERROR) throw new BadRequestError(BAD_REQUEST_TXT);
    if (err.name === CAST_ERROR_NAME) throw new BadRequestError(WRONG_ID_TXT);
  }
  return movieEntry;
};

export default mongoose.model('movie', movieSchema);
