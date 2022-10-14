import {
  SERVER_ERROR, SERVER_ERROR_TXT, BAD_REQUEST_TXT, BAD_REQUEST,
  VALIDATION_ERROR, CAST_ERROR_NAME, WRONG_ID_TXT, TYPE_ERROR_NAME,
} from '../utils/constants.js';

export default function globalErrorHandler(err, req, res, next) {
  // incoming errors
  if (err.name === TYPE_ERROR_NAME) res.status(BAD_REQUEST).send({ error: BAD_REQUEST_TXT });
  if (err.name === VALIDATION_ERROR) res.status(BAD_REQUEST).send({ error: BAD_REQUEST_TXT });
  if (err.name === CAST_ERROR_NAME) res.status(BAD_REQUEST).send({ error: WRONG_ID_TXT });

  const { statusCode = SERVER_ERROR, message } = err;
  res.status(statusCode).json({
    error: statusCode === SERVER_ERROR ? SERVER_ERROR_TXT : message,
  });

  next();
}
