import express from 'express';

import routes from './routes/routes.js';
import Database from './utils/Databse.js';

const app = express();

app.use(express.json()); // body-parser is bundled with Express >4.16
app.use(express.urlencoded({ extended: true }));

Database.getInstance();
app.use(routes);

export default app;
