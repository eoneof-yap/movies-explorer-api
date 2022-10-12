import movieModel from '../models/movieModel.js';

import { validationErrorHandler, objectIdErrorHanler } from '../utils/utils.js';
import BadRequestError from '../errors/BadRequestError.js';
import { CREATED, MOVIE_NOT_FOUND_TXT } from '../utils/constants.js';

const Movie = movieModel;

/**
 * Register a movie
 * @returns {{ movie: { _id: string, name: string, email: string } }} movie instance
 */
export async function createMovie(req, res, next) {
  const { movieData } = req.body;
  try {
    const movie = await Movie.createNew({ movieData });
    res.status(CREATED).send(movie);
  } catch (err) {
    next(err);
  }
  return next();
}

/**
 * Get current movie info
 * @returns {{ movie: { _id: string, name: string, email: string } }} movie instance
 */
export async function getMovies(req, res, next) {
  const { id } = req.body;
  try {
    const movie = await Movie.findById(id);
    if (!movie) return next(new BadRequestError(MOVIE_NOT_FOUND_TXT));

    return res.send(movie);
  } catch (err) {
    validationErrorHandler(err, next);
    objectIdErrorHanler(err, next);
    next(err);
  }
  return next();
}

export async function deleteMovieById(req, res, next) {
  res.send('deletemoviebyid');
  return next();
}
