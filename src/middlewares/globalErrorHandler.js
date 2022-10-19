import { SERVER_ERROR, SERVER_ERROR_TXT } from '../utils/constants.js';

export default function globalErrorHandler(err, req, res, next) {
  const { statusCode = SERVER_ERROR, message } = err;

  res.status(statusCode).json({
    error: statusCode === SERVER_ERROR ? SERVER_ERROR_TXT : message,
  });

  return next();
}
