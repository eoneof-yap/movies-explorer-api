import dotenv from 'dotenv';
import express from 'express';
import process from 'process';
import { errors } from 'celebrate';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

import getVirtualDbInstance from '../__tests__/utils/testHelpers.js';

import {
  logRequestsToFile, logErrorsToFile, logRequestsToConsole, logErrosToConsole,
} from './middlewares/loggers.js';

import publicRoutes from './routes/public.routes.js';
import checkAuth from './middlewares/checkAuth.js';
import privateRoutes from './routes/private.routes.js';

import notFound from './controllers/notFound.controller.js';

dotenv.config();
const app = express();

const limiter = rateLimit({
  windowMs: 1000 * 60 * 15, // 15min
  max: 100,
});

const { NODE_ENV = 'production', JWT_SECRET = '123-ABC-XYZ' } = process.env;

if (NODE_ENV === 'production') {
  app.use(logRequestsToFile);
} else if (NODE_ENV === 'testing') {
  // connect to virtual DB while testing
  getVirtualDbInstance();
} else {
  app.use(logRequestsToConsole);
}

app.use(cors());
app.use(limiter);
app.use(helmet.hidePoweredBy());

app.use(express.json()); // body-parser is bundled with Express >4.16
app.use(cookieParser(JWT_SECRET));

// public routes
app.use(publicRoutes);

// protected routes
app.use(checkAuth);
app.use(privateRoutes);

app.use(errors()); // catch Joi validation errors

if (NODE_ENV === 'production') {
  app.use(logErrorsToFile);
} else if (NODE_ENV === 'development') {
  app.use(logErrosToConsole);
}

app.all('*', notFound);

export default app; // to server.js
