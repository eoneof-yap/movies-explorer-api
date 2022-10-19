import { BAD_REQUEST } from '../utils/constants.js';

export default class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}
