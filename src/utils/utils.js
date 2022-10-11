import BadRequestError from '../errors/BadRequestError.js';
import { BAD_REQUEST_TXT } from './constants.js';

const validationErrorHandler = (err, next) => {
  if (err.name === 'ValidationError') {
    next(new BadRequestError(BAD_REQUEST_TXT));
  }
};

export default validationErrorHandler;
