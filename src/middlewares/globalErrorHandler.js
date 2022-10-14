import {
  SERVER_ERROR, SERVER_ERROR_TXT, BAD_REQUEST_TXT, BAD_REQUEST,
} from '../utils/constants.js';

export default function globalErrorHandler(err, req, res, next) {
  if (err.name === 'TypeError') res.status(BAD_REQUEST).send({ error: BAD_REQUEST_TXT });

  const { statusCode = SERVER_ERROR, message } = err;
  res.status(statusCode).json({
    error: statusCode === SERVER_ERROR ? SERVER_ERROR_TXT : message,
  });

  next();
}
