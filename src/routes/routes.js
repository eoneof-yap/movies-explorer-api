import express from 'express';

import { USER_PATH, MOVIES_PATH } from '../utils/constants.js';
import {
  deleteMovieById, getMovies, getUser, updateMovies, updateUser,
} from '../controllers/controllers.js';

const routes = express();

routes.get(USER_PATH, getUser)
  .patch(USER_PATH, updateUser);

routes.get(MOVIES_PATH, getMovies)
  .post(MOVIES_PATH, updateMovies)
  .delete(`${MOVIES_PATH}/:id`, deleteMovieById);

export default routes;
