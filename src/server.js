// TODO: REPLACE CONSOLE LOG WITH ERROR HANDLER

import process from 'process';
import mongoose from 'mongoose';

import app from './app.js';

const {
  NODE_ENV = 'production', PORT = 3000,
  DB_PATH = 'mongodb://127.0.0.1:27017/moviexdb',
} = process.env;

(async () => {
  try {
    await mongoose.connect(DB_PATH);
    await app.listen(PORT, () => {
      console.log(`Сервер запущен на ${PORT} порту в режиме "${NODE_ENV}"`);
    });
  } catch (err) {
    console.log(`Сервер не запущен: ${err}`);
  }
})();

process.on('uncaughtException', (err, origin) => {
  console.log(
    `Необработанная ошибка: "${origin}" "${err.name}" "${err.message}"`,
  );
});
