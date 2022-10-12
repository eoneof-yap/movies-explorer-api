import NotFoundError from '../errors/NotFoundError.js';
import movieModel from '../models/movie.model.js';

import { CREATED, MOVIE_NOT_FOUND_TXT } from '../utils/constants.js';

const Movie = movieModel;

/**
 * Add a movie to favorites list
 * @param { object } movieProps movie properties
 * @returns { movieEntry } movie entry
 */
export async function createMovie(req, res, next) {
  const { movieProps } = req.body;
  try {
    const movieEntry = await Movie.createNew(movieProps);
    return res.status(CREATED).send(movieEntry);
  } catch (err) {
    next(err);
  }
  return next();
}

/**
 * Get current movie info
 * @returns {Object[]}  movies list
 */
export async function getMovies(req, res, next) {
  try {
    const moviesList = await Movie.find({});
    if (!moviesList) return next(new NotFoundError(MOVIE_NOT_FOUND_TXT));
    return res.send(moviesList);
  } catch (err) {
    next(err);
  }
  return next();
}

export async function deleteMovieById(req, res, next) {
  const { id } = req.params;
  const movieEntry = await Movie.findById(id);
  res.send(movieEntry);
  return next();
}
