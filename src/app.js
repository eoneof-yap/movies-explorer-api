import process from 'process';
import express from 'express';
import mongoose from 'mongoose';

import routes from './routes/routes.js';

const {
  NODE_ENV = 'production', PORT = 3000,
  DB_PATH = 'mongodb://127.0.0.1:27017/moviexdb',
} = process.env;

const app = express();

app.use(express.json()); // body-parser is bundled with Express >4.16
app.use(express.urlencoded({ extended: true }));

app.use(routes);

mongoose.connect(DB_PATH);
app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту в режиме "${NODE_ENV}"`);
});

process.on('uncaughtException', (err, origin) => {
  // TODO: replace console log with error handler
  // eslint-disable-next-line no-console
  console.log(
    `Необработанная ошибка: "${origin}" "${err.name}" "${err.message}"`,
  );
});
