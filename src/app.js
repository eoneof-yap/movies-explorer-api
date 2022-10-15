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

import routes from './routes/index.js';
import notFound from './controllers/notFound.controller.js';

dotenv.config();
const app = express();
const { NODE_ENV = 'production', JWT_SECRET = '123-ABC-XYZ' } = process.env;

const limiter = rateLimit({ windowMs: 1000 * 60 * 15, /* 15min */ max: 100 });
app.use(helmet.hidePoweredBy());
app.use(limiter);
app.use(cors());

if (NODE_ENV === 'production') {
  app.use(logRequestsToFile);
} else if (NODE_ENV === 'testing') {
  // connect to virtual DB while testing
  getVirtualDbInstance();
} else {
  app.use(logRequestsToConsole);
}

app.use(express.json()); // body-parser is bundled with Express >4.16
app.use(cookieParser(JWT_SECRET));

app.use(routes);

app.use(errors()); // catch Joi validation errors

if (NODE_ENV === 'production') {
  app.use(logErrorsToFile);
} else if (NODE_ENV === 'development') {
  app.use(logErrosToConsole);
}

app.all('*', notFound); // handle global 404 error

export default app; // to server.js
