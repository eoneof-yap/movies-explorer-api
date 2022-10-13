import { AUTH_REQUIRED_TXT, BAD_REQUEST_TXT } from './constants.js';

import BadRequestError from '../errors/BadRequestError.js';
import UnauthorizedError from '../errors/UnauthorizedError.js';

// handle mongoose schema validation
export const validationErrorHandler = (err, next) => {
  if (err.name === 'ValidationError') {
    next(new BadRequestError(BAD_REQUEST_TXT));
  }
  next(err);
};

// handle mongodb item  id error
export const objectIdErrorHanler = (err) => {
  if (err.kind === 'ObjectId') {
    return new UnauthorizedError(AUTH_REQUIRED_TXT);
  }
  return err;
};
