/* eslint-disable no-console */

import winston from 'winston';
import expressWinston from 'express-winston';

import { ERRORS_LOG, REQUESTS_LOG, EVENTS_LOG } from '../utils/constants.js';

const cookieFilter = (req, header) => {
  if (header !== 'headers') return req[header];
  const { cookie, ...rest } = req.headers;
  return rest;
};

export const logRequestsToFile = expressWinston.logger({
  transports: [new winston.transports.File({ filename: REQUESTS_LOG })],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.timestamp(),
  ),
  requestFilter: cookieFilter,
});

export const logErrorsToFile = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: ERRORS_LOG })],
  format: winston.format.json(),
});

export const logEventsToFile = winston.createLogger({
  transports: [new winston.transports.File({ filename: EVENTS_LOG })],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
});

export const logRequestsToConsole = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.simple(),
    winston.format.timestamp(),
  ),
  msg: 'HTTP {{req.method}}\n      {{req.url}}', // formatting!
});

export const logErrosToConsole = expressWinston.errorLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.simple(),
    winston.format.timestamp(),
  ),
});

const timeStamp = () => new Date().toLocaleString();

export const logEventsToConsole = (message) => {
  console.log(`${timeStamp()} ${message}`);
};
