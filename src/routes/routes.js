import express from 'express';

import {
  MOVIES_PATH, MOVIE_ID_PATH,
} from '../utils/constants.js';
import { deleteMovieById, getMovies, createMovie } from '../controllers/controllers.js';

import authRoute from './authRoute.js';
import userRoute from './userRoute.js';
import authorize from '../middlewares/authorize.js';
import { validateMovieInfo } from '../middlewares/validators.js';

const routes = express();

// public routesdd
routes.use(authRoute);

// protected routes
routes.use(authorize);
routes.use(userRoute);

// moviesRoute
routes.get(MOVIES_PATH, getMovies)
  .post(MOVIES_PATH, validateMovieInfo, createMovie)
  .delete(MOVIE_ID_PATH, deleteMovieById);

export default routes;
