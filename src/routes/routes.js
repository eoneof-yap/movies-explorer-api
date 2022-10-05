import express from 'express';

import { USER_PATH, MOVIES_PATH } from '../utils/constants.js';
import {
  deleteMovieById, getMovieList, getUserInfo, updateMovieList, updateUserInfo,
} from '../controllers/controllers.js';

const routes = express();

routes.get(USER_PATH, getUserInfo)
  .patch(USER_PATH, updateUserInfo);

routes.get(MOVIES_PATH, getMovieList)
  .post(MOVIES_PATH, updateMovieList)
  .delete(`${MOVIES_PATH}/:id`, deleteMovieById);

export default routes;
