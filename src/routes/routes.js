import express from 'express';

import { MOVIES_PATH } from '../utils/constants.js';
import { deleteMovieById, getMovies, createMovie } from '../controllers/controllers.js';

import authRoute from './authRoute.js';
import userRoute from './userRoute.js';
import authorize from '../middlewares/authorize.js';

const routes = express();

// public routesdd
routes.use(authRoute);

// protected routes
routes.use(authorize);
routes.use(userRoute);

// moviesRoute
routes.get(MOVIES_PATH, getMovies)
  .post(MOVIES_PATH, createMovie)
  .delete(`${MOVIES_PATH}/:id`, deleteMovieById);

export default routes;
