import { NOT_FOUND } from '../utils/constants.js';

export default class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}
