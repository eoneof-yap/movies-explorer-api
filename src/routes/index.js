import express from 'express';

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

export default routes;
