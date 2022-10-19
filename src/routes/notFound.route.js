import express from 'express';

import notFoundController from '../controllers/notFound.controller.js';

const notFoundRoute = express.Router();

notFoundRoute.all('*', notFoundController); // handle global 404 error

export default notFoundRoute;
