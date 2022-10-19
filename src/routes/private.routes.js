import express from 'express';

import {
  CURRENT_USER_PATH, MOVIES_PATH, MOVIE_ID_PATH, LOGOUT_PATH,
} from '../utils/constants.js';

import { validateUpdate, validateMovieInfo, validateId } from '../middlewares/validators.js';
import { getUser, updateUser, logout } from '../controllers/user.controller.js';
import { createMovie, getMovies, deleteMovieById } from '../controllers/movies.controller.js';

const privateRouter = express.Router();

// user
privateRouter.get(CURRENT_USER_PATH, getUser)
  .patch(CURRENT_USER_PATH, validateUpdate, updateUser)
  .delete(LOGOUT_PATH, logout);

// movies
privateRouter.get(MOVIES_PATH, getMovies)
  .post(MOVIES_PATH, validateMovieInfo, createMovie)
  .delete(MOVIE_ID_PATH, validateId, deleteMovieById);

export default privateRouter;
