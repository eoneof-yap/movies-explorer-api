import express from 'express';

import notFound from '../controllers/notFound.controller.js';

import publicRoutes from './public.routes.js';
import checkAuth from '../middlewares/checkAuth.js';
import privateRoutes from './private.routes.js';
import notFoundRoute from './notFound.route.js';

const routes = express.Router();

// public routes
routes.use(publicRoutes);

// protected routes
routes.use(checkAuth);
routes.use(privateRoutes);
routes.use(notFoundRoute);

// handle global 404 error
routes.all('*', notFound);

export default routes;
