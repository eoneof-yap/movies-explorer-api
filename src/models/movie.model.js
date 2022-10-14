import mongoose from 'mongoose';
import isURL from 'validator/lib/isURL.js';
import BadRequestError from '../errors/BadRequestError.js';
import ConflictError from '../errors/ConflictError.js';
import {
  VALIDATION_ERROR, BAD_REQUEST_TXT, DB_DUPLICATE_KEY_CODE,
  MOVIE_EXIST_TXT, WRONG_ID_TXT, CAST_ERROR,
} from '../utils/constants.js';

const movieSchema = new mongoose.Schema({
  movieId: {
    required: true,
    unique: true,
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
  trailer: {
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

movieSchema.statics.createNew = async function createNew({ ...movie }) {
  let movieEntry;
  try {
    movieEntry = await this.create({ ...movie });
    if (!movieEntry) throw new BadRequestError(BAD_REQUEST_TXT);

    movieEntry = movieEntry.toObject();
    delete movieEntry.__v;
  } catch (err) {
    if (err.name === VALIDATION_ERROR) throw new BadRequestError(BAD_REQUEST_TXT);
    if (err.code === DB_DUPLICATE_KEY_CODE) throw new ConflictError(MOVIE_EXIST_TXT); // mongo err
    if (err.name === CAST_ERROR) throw new BadRequestError(WRONG_ID_TXT);
  }
  return movieEntry;
};

export default mongoose.model('movie', movieSchema);
