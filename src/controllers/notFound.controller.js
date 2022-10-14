import { PATH_NOT_FOUND_TXT } from '../utils/constants.js';

import NotFoundError from '../errors/NotFoundError.js';

export default function notFound(err, req, res, next) {
  return next(new NotFoundError(PATH_NOT_FOUND_TXT));
}
