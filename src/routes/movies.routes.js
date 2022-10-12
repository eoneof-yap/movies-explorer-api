import express from 'express';

import { MOVIES_PATH, MOVIE_ID_PATH } from '../utils/constants.js';
import { createMovie, getMovies, deleteMovieById } from '../controllers/moviesController.js';
import { validateId, validateMovieInfo } from '../middlewares/validators.js';

const moviesRoute = express.Router();

moviesRoute.get(MOVIES_PATH, getMovies)
  .post(MOVIES_PATH, validateMovieInfo, createMovie)
  .delete(MOVIE_ID_PATH, validateId, deleteMovieById);

export default moviesRoute;
