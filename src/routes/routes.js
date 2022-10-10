import express from 'express';

import { MOVIES_PATH } from '../utils/constants.js';
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
  .delete(`${MOVIES_PATH}/:id`, deleteMovieById);

export default routes;
