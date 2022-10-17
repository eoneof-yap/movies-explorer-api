import dotenv from 'dotenv';
import process from 'process';
import mongoose from 'mongoose';

import app from './app.js';

import {
  SERVER_ERROR, SERVER_ERROR_TXT, runtimeDb, runtimePort, runtimeMode,
  UNCAUGHT_EXCEPTION, UNHANDLED_ERROR_NAME,
} from './utils/constants.js';

import globalErrorHandler from './middlewares/globalErrorHandler.js';
import { logEventsToFile, logEventsToConsole } from './middlewares/loggers.js';

dotenv.config();

const { NODE_ENV = runtimeMode, PORT = runtimePort, DB_PATH = runtimeDb } = process.env;

(async () => {
  try {
    await mongoose.connect(DB_PATH);
    await app.listen(PORT, () => {
      if (NODE_ENV === 'production') {
        logEventsToFile.info(`Сервер запущен на ${PORT} порту в режиме "${NODE_ENV}"`);
      } else if (NODE_ENV === 'development') {
        logEventsToConsole.log({ level: 'info', message: `Сервер запущен на ${PORT} порту в режиме "${NODE_ENV}"` });
      }
    });
  } catch (err) {
    if (NODE_ENV === 'production') {
      logEventsToFile.info(`Сервер не запустился ${err}`);
    } else if (NODE_ENV === 'development') {
      logEventsToConsole.log({ level: 'info', message: `Сервер не запустился ${err}` });
    }
  }
})();

app.use(globalErrorHandler);

process.on(UNCAUGHT_EXCEPTION, (err, origin) => {
  logEventsToConsole.log({ level: 'info', message: `${UNHANDLED_ERROR_NAME} ${origin}" "${err.name}" "${err.message}" "${err.stack}` });
  app.use((res) => {
    res.status(SERVER_ERROR).send(SERVER_ERROR_TXT);
  });
});
