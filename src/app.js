import express from 'express';
import process from 'process';

import getVirtualDbInstance from '../__tests__/utils/testHelpers.js';

import routes from './routes/routes.js';

const { NODE_ENV = 'production' } = process.env;

// connect to virtual DB while testing
if (NODE_ENV === 'testing') {
  getVirtualDbInstance();
}

const app = express();

app.use(express.json()); // body-parser is bundled with Express >4.16
app.use(express.urlencoded({ extended: true }));

app.use(routes);

export default app;
