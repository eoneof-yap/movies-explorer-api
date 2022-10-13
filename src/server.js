import dotenv from 'dotenv';
import process from 'process';
import mongoose from 'mongoose';

import app from './app.js';

import globalErrorHandler from './middlewares/globalErrorHandler.js';
import { logEventsToFile, logEventsToConsole } from './middlewares/loggers.js';
import { SERVER_ERROR, SERVER_ERROR_TXT } from './utils/constants.js';

dotenv.config();

const {
  NODE_ENV = 'production', PORT = 3000,
  DB_PATH = 'mongodb://127.0.0.1:27017/moviexdb',
} = process.env;

(async () => {
  try {
    await mongoose.connect(DB_PATH);
    await app.listen(PORT, () => {
      if (NODE_ENV === 'production') {
        logEventsToFile.info(`Сервер запущен на ${PORT} порту в режиме "${NODE_ENV}"`);
      } else if (NODE_ENV === 'development') {
        logEventsToConsole(`Сервер запущен на ${PORT} порту в режиме "${NODE_ENV}"`);
      }
    });
  } catch (err) {
    if (NODE_ENV === 'production') {
      logEventsToFile.info(`Сервер не запустился ${err}`);
    } else if (NODE_ENV === 'development') {
      logEventsToConsole(`Сервер не запустился ${err}`);
    }
  }
})();

app.use(globalErrorHandler);

process.on('uncaughtException', (err, origin) => {
  logEventsToConsole(`Необработанная ошибка: "${origin}" "${err.name}" "${err.message}" "${err.stack}`);
  app.use((res) => {
    res.status(SERVER_ERROR).send(SERVER_ERROR_TXT);
  });
});
