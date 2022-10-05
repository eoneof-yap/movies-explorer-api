import express from 'express';
import {
  deleteMovieById, getMovieList, getUserInfo, updateMovieList, updateUserInfo,
} from '../controllers/controllers.js';

const routes = express();

routes.get('/users/me', getUserInfo);
routes.patch('/users/me', updateUserInfo);
routes.get('/movies', getMovieList);
routes.post('/movies', updateMovieList);
routes.delete('/movies/:id', deleteMovieById);

export default routes;
