import process from 'process';
import dotenv from 'dotenv';
import { SERVER_ERROR, SERVER_ERROR_TXT } from '../utils/constants.js';

dotenv.config();

const { NODE_ENV = 'production' } = process.env;

export default function globalErrorHandler(err, req, res, next) {
  const { statusCode = SERVER_ERROR, message } = err;

  res.status(statusCode).json(
    {
      error: statusCode === SERVER_ERROR ? SERVER_ERROR_TXT : message,
      stack: NODE_ENV !== 'development' ? err.stack : '',
    },
  );

  next();
}
