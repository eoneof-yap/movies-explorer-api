import NotFoundError from '../errors/NotFoundError.js';
import movieModel from '../models/movie.model.js';

import {
  CREATED, MOVIE_NOT_FOUND_TXT, MOVIE_DELETED_TXT, MOVIE_RESTRICTED_TXT,
  MOVIE_ADDED_TXT, MOVIES_LIST_EMPTY, MOVIE_EXIST_TXT, CAST_ERROR_NAME, WRONG_ID_TXT,
} from '../utils/constants.js';

import ForbiddenError from '../errors/ForbiddenError.js';
import ConflictError from '../errors/ConflictError.js';
import BadRequestError from '../errors/BadRequestError.js';

const Movie = movieModel;

/**
 * Add a movie to favorites list
 * @returns { movieEntry } movie entry
 */
export async function createMovie(req, res, next) {
  try {
    const { user } = req.cookies;
    const { ...movieProps } = req.body;
    const { movieId } = movieProps;

    // check if movie is in the list
    const exist = await Movie.find({ $and: [{ movieId }, { owner: user._id }] });
    if (exist.length > 0) return next(new ConflictError(MOVIE_EXIST_TXT));

    const movieEntry = await Movie.createEntry({ owner: user._id, ...movieProps });

    return res.status(CREATED).send({ message: MOVIE_ADDED_TXT, movieEntry });
  } catch (err) {
    next(err);
  }
  return next();
}

/**
 * Get current movie info
 * @returns {[{}]} an array of movies
 */
export async function getMovies(req, res, next) {
  try {
    const { user } = req.cookies;
    const moviesList = await Movie.find({ owner: user._id });
    if (moviesList.length === 0) return res.send({ message: MOVIES_LIST_EMPTY });

    const arr = [];
    moviesList.forEach((item) => {
      const movie = item.toObject();
      delete movie.__v;
      arr.push(movie);
    });
    return res.send(arr);
  } catch (err) {
    next(err);
  }
  return next();
}

/**
 * Delete a movie entry
 * @returns deleted item
 */
export async function deleteMovieById(req, res, next) {
  try {
    const { id } = req.params;
    const { user } = req.cookies;
    let movieEntry = await Movie.findById(id);
    if (!movieEntry) return next(new NotFoundError(MOVIE_NOT_FOUND_TXT));

    // check if the user is owner
    if (user._id !== movieEntry.owner.toString()) {
      return next(new ForbiddenError(MOVIE_RESTRICTED_TXT));
    }
    movieEntry = await Movie.deleteEntry(id);
    return res.send({ message: MOVIE_DELETED_TXT, movieEntry });
  } catch (err) {
    if (err.name === CAST_ERROR_NAME) return next(new BadRequestError(WRONG_ID_TXT));
    next(err);
  }
  return next();
}
