import { UNAUTHORIZED } from '../utils/constants.js';

export default class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}
