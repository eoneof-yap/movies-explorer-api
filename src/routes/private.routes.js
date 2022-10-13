import express from 'express';

import { CURRENT_USER_PATH, MOVIES_PATH, MOVIE_ID_PATH } from '../utils/constants.js';
import { getUser, updateUser } from '../controllers/userController.js';
import { validateId, validateUpdate, validateMovieInfo } from '../middlewares/validators.js';
import { createMovie, getMovies, deleteMovieById } from '../controllers/moviesController.js';

const privateRouter = express.Router();

// user
privateRouter.get(CURRENT_USER_PATH, validateId, getUser)
  .patch(CURRENT_USER_PATH, validateUpdate, updateUser);

// movies
privateRouter.get(MOVIES_PATH, getMovies)
  .post(MOVIES_PATH, validateMovieInfo, createMovie)
  .delete(MOVIE_ID_PATH, validateId, deleteMovieById);

export default privateRouter;
