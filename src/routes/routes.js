import express from 'express';

import {
  MOVIES_PATH, MOVIE_ID_PATH,
} from '../utils/constants.js';
import { deleteMovieById, getMovies, createMovie } from '../controllers/controllers.js';

// import authRoute from './authRoute.js';
// import validateToken from '../middlewares/validateToken.js';
import { validateMovieInfo } from '../middlewares/validators.js';
// import notFound from '../controllers/notFoundController.js';

const routes = express.Router();

// routes.all('*', (req, res, next) => {
//   if (req.url === '/' || req.url === REGISTER_PATH || req.url === USERS_PATH) {
//     return next();
//   }
//   return notFound(req, res, next);
// });

// moviesRoute
routes.get(MOVIES_PATH, getMovies)
  .post(MOVIES_PATH, validateMovieInfo, createMovie)
  .delete(MOVIE_ID_PATH, deleteMovieById);

export default routes;
