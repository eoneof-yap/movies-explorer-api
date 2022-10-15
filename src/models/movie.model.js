import mongoose from 'mongoose';
import isURL from 'validator/lib/isURL.js';

import {
  VALIDATION_ERROR, CAST_ERROR_NAME, MOVIE_EXIST_TXT,
  WRONG_ID_TXT, BAD_REQUEST_TXT, MOVIE_NOT_FOUND_TXT,
  MOVIE_RESTRICTED_TXT,
} from '../utils/constants.js';

import BadRequestError from '../errors/BadRequestError.js';
import ConflictError from '../errors/ConflictError.js';
import NotFoundError from '../errors/NotFoundError.js';
import ForbiddenError from '../errors/ForbiddenError.js';

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
  owner: [
    {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    },
  ],
  nameRU: {
    required: true,
    type: String,
  },
  nameEN: {
    required: true,
    type: String,
  },
});

movieSchema.statics.createEntry = async function createEntry(userId, { owner, ...movie }, next) {
  let movieEntry;
  const { movieId } = movie;
  try {
    // check if movie is in the list
    movieEntry = await this.findOne({ movieId });
    if (!movieEntry) {
      movieEntry = await this.create({ owner, ...movie }); // if not add one
      if (!movieEntry) return next(new BadRequestError(BAD_REQUEST_TXT));
    } else if (movieEntry.owner.includes(userId)) {
      return next(new ConflictError(MOVIE_EXIST_TXT));
    }

    // if exist add owners
    movieEntry = await this.findByIdAndUpdate(
      movieEntry._id,
      { $addToSet: { owner: userId } },
      { new: true },
    );

    // cleanup returned
    movieEntry = movieEntry.toObject();
    delete movieEntry.__v;
  } catch (err) {
    if (err.name === VALIDATION_ERROR) throw new BadRequestError(BAD_REQUEST_TXT);
    if (err.name === CAST_ERROR_NAME) throw new BadRequestError(WRONG_ID_TXT);
    next(err);
  }
  return movieEntry;
};

movieSchema.statics.deleteEntry = async function deleteEntry(movieId, userId, next) {
  let movieEntry;
  try {
    movieEntry = await this.findById(movieId);

    if (!movieEntry) return next(new NotFoundError(MOVIE_NOT_FOUND_TXT));

    // restrict deletion if the user is not in the owners array
    if (!movieEntry.owner.some((owner) => owner === userId)) {
      return next(new ForbiddenError(MOVIE_RESTRICTED_TXT));
    }

    // remove the user from movie's owners
    movieEntry = await this.findByIdAndUpdate(movieId, { $pull: { owner: userId } }, { new: true });

    // delete the entry if there's no owners
    if (movieEntry.owner.lenght === 0) movieEntry = await this.findByIdAndDelete(movieId);

    movieEntry = movieEntry.toObject();
    delete movieEntry.__v;
  } catch (err) {
    if (err.name === VALIDATION_ERROR) throw new BadRequestError(BAD_REQUEST_TXT);
    if (err.name === CAST_ERROR_NAME) throw new BadRequestError(WRONG_ID_TXT);
    next(err);
  }
  return movieEntry;
};

export default mongoose.model('movie', movieSchema);
