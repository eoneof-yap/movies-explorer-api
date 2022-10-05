import process from 'process';
import express from 'express';
import mongoose from 'mongoose';

const {
  NODE_ENV = 'production', PORT = 3000,
  DB_PATH = 'mongodb://127.0.0.1:27017/moviexdb',
} = process.env;

const app = express();

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
