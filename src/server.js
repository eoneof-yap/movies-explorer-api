import process from 'process';
import mongoose from 'mongoose';
import { errors } from 'celebrate';

import app from './app.js';

import globalErrorHandler from './middlewares/globalErrorHandler.js';
import { errorLogger, eventLogger, logEventsToConsole } from './middlewares/loggers.js';

const {
  NODE_ENV = 'production', PORT = 3000,
  DB_PATH = 'mongodb://127.0.0.1:27017/moviexdb',
} = process.env;

(async () => {
  try {
    await mongoose.connect(DB_PATH);
    await app.listen(PORT, () => {
      if (NODE_ENV === 'production') {
        eventLogger.info(`Сервер запущен на ${PORT} порту в режиме "${NODE_ENV}"`);
        return;
      }
      logEventsToConsole(`Сервер запущен на ${PORT} порту в режиме "${NODE_ENV}"`);
    });
  } catch (err) {
    if (NODE_ENV === 'production') {
      eventLogger.info(`Сервер не запустился ${err}`);
      return;
    }
    logEventsToConsole(`Сервер не запустился ${err}`);
  }
})();

// error handling
app.use(errors());
app.use(errorLogger);
app.use(globalErrorHandler);
process.on('uncaughtException', (err, origin) => {
  logEventsToConsole(`Необработанная ошибка: "${origin}" "${err.name}" "${err.message}" "${err.stack}`);
});
