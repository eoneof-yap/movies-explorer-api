import express from 'express';

import { MOVIES_PATH } from '../utils/constants.js';
import { deleteMovieById, getMovies, createMovie } from '../controllers/controllers.js';
import userRoute from './userRoute.js';
import authRoute from './authRoute.js';

const routes = express();

routes.use(authRoute);

// TODO: protect with auth
routes.use(userRoute);

// moviesRoute
routes.get(MOVIES_PATH, getMovies)
  .post(MOVIES_PATH, createMovie)
  .delete(`${MOVIES_PATH}/:id`, deleteMovieById);

export default routes;
