import express from 'express';

import userRoute from './user.routes.js';
import movieRoute from './movies.routes.js';

const privateRouter = express.Router();

privateRouter.use(userRoute);
privateRouter.use(movieRoute);

export default privateRouter;
