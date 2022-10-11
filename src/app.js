import express from 'express';
import process from 'process';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';

import getVirtualDbInstance from '../__tests__/utils/testHelpers.js';

import { requestLogger } from './middlewares/loggers.js';
import notFound from './controllers/notFoundController.js';

import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import validateCookie from './middlewares/validateToken.js';

const { NODE_ENV = 'production' } = process.env;

// connect to virtual DB while testing
if (NODE_ENV === 'testing') {
  getVirtualDbInstance();
}

const app = express();

app.use(express.json()); // body-parser is bundled with Express >4.16
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(requestLogger);

// public routes
app.use(authRoute);

// app.use(routes); // main routes

// protected routes
app.use(validateCookie);
app.use(userRoute);

// TODO: catch unauthorized 404s
app.use(notFound); // 404
app.use(errors()); // catch Joi validation errors

export default app; // to server.js
