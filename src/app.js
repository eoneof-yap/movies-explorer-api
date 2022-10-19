import dotenv from 'dotenv';
import express from 'express';
import process from 'process';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

import getVirtualDbInstance from '../__tests__/utils/testHelpers.js';

import { runtimeKey, runtimeMode } from './utils/constants.js';

import {
  logRequestsToFile, logErrorsToFile, logRequestsToConsole, logErrosToConsole,
} from './middlewares/loggers.js';

import limiter from './utils/rateLimit.js';
import routes from './routes/index.js';

dotenv.config();
const app = express();
const { NODE_ENV = runtimeMode, JWT_SECRET = runtimeKey } = process.env;

if (NODE_ENV === 'production') {
  app.use(logRequestsToFile);
} else if (NODE_ENV === 'testing') {
  getVirtualDbInstance(); // connect to virtual DB while testing
} else {
  app.use(logRequestsToConsole);
}

app.use(helmet.hidePoweredBy());
app.use(limiter);
app.use(cors());

app.use(express.json()); // body-parser is bundled with Express >4.16
app.use(cookieParser(JWT_SECRET));

app.use(routes); // main routes

app.use(errors()); // catch Joi validation errors

if (NODE_ENV === 'production') {
  app.use(logErrorsToFile);
} else if (NODE_ENV === 'development') {
  app.use(logErrosToConsole);
}

export default app; // to server.js
