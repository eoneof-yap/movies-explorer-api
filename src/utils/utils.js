import { AUTH_REQUIRED_TXT, BAD_REQUEST_TXT } from './constants.js';

import BadRequestError from '../errors/BadRequestError.js';
import UnauthorizedError from '../errors/UnauthorizedError.js';

// handle mongoose schema validation
export const validationErrorHandler = (err) => {
  if (err.name === 'ValidationError') {
    throw new BadRequestError(BAD_REQUEST_TXT);
  }
  return err;
};

// handle mongodb item  id error
export const objectIdErrorHanler = (err) => {
  if (err.kind === 'ObjectId') {
    throw new UnauthorizedError(AUTH_REQUIRED_TXT);
  }
  return err;
};
