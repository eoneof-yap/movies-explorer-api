import process from 'process';
import express from 'express';
import mongoose from 'mongoose';

const app = express();
const {
  NODE_ENV = 'production',
  DB_PATH = 'mongodb://127.0.0.1:27017/moviexdb',
  PORT = 3000,
} = process.env;

mongoose.connect(DB_PATH);
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT} in ${NODE_ENV} mode`);
});

process.on('uncaughtException', (err, origin) => {
  // TODO: replace console log with error handler
  // eslint-disable-next-line no-console
  console.log(
    `Необработанная ошибка: "${origin}" "${err.name}" "${err.message}"`,
  );
});
