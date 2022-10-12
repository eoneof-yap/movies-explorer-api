import express from 'express';
import { errors } from 'celebrate';

import userRoute from './user.routes.js';
import movieRoute from './movies.routes.js';

const routes = express.Router();

routes.use(userRoute);
routes.use(movieRoute);

routes.use(errors());

export default routes;
