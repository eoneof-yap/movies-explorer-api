import dotenv from 'dotenv';
import express from 'express';
import process from 'process';
import { errors } from 'celebrate';
// import cookieParser from 'cookie-parser'; TODO

import getVirtualDbInstance from '../__tests__/utils/testHelpers.js';

import {
  logRequestsToFile, logErrorsToFile, logRequestsToConsole, logErrosToConsole,
} from './middlewares/loggers.js';

import validateToken from './middlewares/validateToken.js';
import publicRoutes from './routes/public.routes.js';
import privateRoutes from './routes/private.routes.js';

import notFound from './controllers/notFound.controller.js';

dotenv.config();
const app = express();

const { NODE_ENV = 'production' /* JWT_SECRET = '123-ABC-XYZ' */ } = process.env;

if (NODE_ENV === 'production') {
  app.use(logRequestsToFile);
} else if (NODE_ENV === 'testing') {
  // connect to virtual DB while testing
  getVirtualDbInstance();
} else {
  app.use(logRequestsToConsole);
}

app.use(express.json()); // body-parser is bundled with Express >4.16
app.use(express.urlencoded({ extended: true }));

// public routes
app.use(publicRoutes);

// protected routes
app.use(validateToken);
app.use(privateRoutes);

app.use(errors()); // catch Joi validation errors

if (NODE_ENV === 'production') {
  app.use(logErrorsToFile);
} else if (NODE_ENV === 'development') {
  app.use(logErrosToConsole);
}
app.all('*', notFound); // TODO fix 404 error handling

export default app; // to server.js
