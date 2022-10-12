import express from 'express';
import process from 'process';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';

import getVirtualDbInstance from '../__tests__/utils/testHelpers.js';

import { requestLogger } from './middlewares/loggers.js';
import notFound from './controllers/notFoundController.js';

import publicroutes from './routes/public.router.js';
import validateCookie from './middlewares/validateCookie.js';
import privateRoutes from './routes/private.router.js';

const { NODE_ENV = 'production' } = process.env;

const JWT_SECRET = process.env.NODE_ENV === 'production'
  ? process.env.JWT_SECRET
  : '123-ABC-XYZ';

// connect to virtual DB while testing
if (NODE_ENV === 'testing') {
  getVirtualDbInstance();
}

const app = express();

app.use(express.json()); // body-parser is bundled with Express >4.16
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(JWT_SECRET));

app.use(requestLogger);

// public routes
app.use(publicroutes);

// protected routes
app.use(validateCookie);
app.use(privateRoutes);

app.use(errors()); // catch Joi validation errors
app.use(notFound); // 404

export default app; // to server.js
