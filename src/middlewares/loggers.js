/* eslint-disable no-console */

import winston from 'winston';
import expressWinston from 'express-winston';

export const logRequestsToFile = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: './logs/request.log' }),
  ],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.timestamp(),
  ),
});

export const logRequestsToConsole = expressWinston.logger({
  transports: [
    new winston.transports.Console(),
  ],
  format: winston.format.combine(
    winston.format.simple(),
    winston.format.timestamp(),
  ),
  msg: 'HTTP {{req.method}}\n      {{req.url}}',
});

export const logErrorsToFile = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: './logs/error.log' }),
  ],
  format: winston.format.json(),
});

export const logErrosToConsole = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: './logs/error.log' }),
  ],
  format: winston.format.combine(
    winston.format.simple(),
    winston.format.timestamp(),
  ),
});

export const logEventsToFile = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: './logs/events.log' }),
  ],
});

const timeStamp = () => new Date().toLocaleString();

export const logEventsToConsole = (message) => {
  console.log(`${timeStamp()} ${message}`);
};
