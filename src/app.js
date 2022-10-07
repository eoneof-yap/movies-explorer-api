import express from 'express';
import process from 'process';

import routes from './routes/routes.js';
import Database from './utils/Database.js';

const { NODE_ENV = 'production' } = process.env;

if (NODE_ENV === 'testing') {
  Database.getInstance();
}

const app = express();

app.use(express.json()); // body-parser is bundled with Express >4.16
app.use(express.urlencoded({ extended: true }));

app.use(routes);

export default app;
