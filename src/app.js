import dotenv from 'dotenv';
import express from 'express';
import process from 'process';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

import getVirtualDbInstance from '../__tests__/utils/testHelpers.js';

import {
  runtimeKey, runtimeMode, prodMode, devMode, testMode,
} from './utils/constants.js';

import {
  logRequestsToFile, logErrorsToFile, logRequestsToConsole, logErrosToConsole,
} from './middlewares/loggers.js';

import limiter from './utils/rateLimit.js';
import routes from './routes/index.js';
import notFoundRoute from './routes/notFound.route.js';

dotenv.config();
const app = express();
const { NODE_ENV = runtimeMode, SECRET_KEY = runtimeKey } = process.env;

if (NODE_ENV === prodMode) {
  app.use(logRequestsToFile);
} else if (NODE_ENV === testMode) {
  getVirtualDbInstance(); // connect to virtual DB while testing
} else {
  app.use(logRequestsToConsole);
}

app.use(helmet.hidePoweredBy());
app.use(limiter);
app.use(cors());

app.use(express.json()); // body-parser is bundled with Express >4.16
app.use(cookieParser(SECRET_KEY));

app.use(routes); // main routes

app.use(errors()); // catch Joi validation errors

routes.use(notFoundRoute);

if (NODE_ENV === prodMode) {
  app.use(logErrorsToFile);
} else if (NODE_ENV === devMode) {
  app.use(logErrosToConsole);
}

export default app; // to server.js
