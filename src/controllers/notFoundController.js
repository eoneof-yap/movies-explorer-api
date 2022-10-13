import { PATH_NOT_FOUND_TXT } from '../utils/constants.js';

import NotFoundError from '../errors/NotFoundError.js';

export default function notFound(err, req, res, next) {
  next(new NotFoundError(`${PATH_NOT_FOUND_TXT}: ${req.originalUrl} `));
}
