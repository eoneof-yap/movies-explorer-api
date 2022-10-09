import express from 'express';
import process from 'process';

import getVirtualDbInstance from '../__tests__/utils/testHelpers.js';

import { requestLogger } from './middlewares/loggers.js';
import notFound from './controllers/notFoundController.js';

import routes from './routes/routes.js';

const { NODE_ENV = 'production' } = process.env;

// connect to virtual DB while testing
if (NODE_ENV === 'testing') {
  getVirtualDbInstance();
}

const app = express();

app.use(express.json()); // body-parser is bundled with Express >4.16
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(routes); // main routes

app.use(notFound); // 404

export default app; // to server.js
