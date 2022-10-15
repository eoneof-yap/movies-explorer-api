import movieModel from '../models/movie.model.js';

import {
  CREATED, MOVIE_NOT_FOUND_TXT, MOVIE_DELETED_TXT, MOVIE_ADDED_TXT,
  BAD_REQUEST_TXT,
} from '../utils/constants.js';
import NotFoundError from '../errors/NotFoundError.js';
import BadRequestError from '../errors/BadRequestError.js';

const Movie = movieModel;

/**
 * Add a movie to favorites list
 * @param { object } movieProps movie properties
 * @returns { movieEntry } movie entry
 */
export async function createMovie(req, res, next) {
  try {
    const { user } = req.cookies;
    const { ...movieProps } = req.body;

    // use custom method
    const movieEntry = await Movie.createEntry(user._id, { owner: user._id, ...movieProps }, next);
    res.status(CREATED).send({ message: MOVIE_ADDED_TXT, movieEntry });
  } catch (err) {
    return next(err);
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
    if (!moviesList) return next(new NotFoundError(MOVIE_NOT_FOUND_TXT));
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
    const movieEntry = await Movie.deleteEntry(id, user._id, next);
    // if (!movieEntry) return next(new NotFoundError(MOVIE_NOT_FOUND_TXT));
    return res.send({ message: MOVIE_DELETED_TXT, movieEntry });
  } catch (err) {
    next(err);
  }
  return next();
}
