import httpMocks from 'node-mocks-http';
import { describe, test, expect } from '@jest/globals';

import { getMovies } from '../src/controllers/controllers.js';
import { getUser } from '../src/controllers/userController.js';

describe('Получает данные о пользователе', () => {
  const res = httpMocks.createResponse();
  const req = httpMocks.createRequest({
    method: 'GET',
    url: '/users/me',
  });

  test.skip('Возвращает статус 200', () => {
    getUser(req, res, (err) => {
      expect(err).toBeFalsy();
    });

    expect(res.statusCode).toBe(200);
  });

  test.skip('Объект пользователя соответствует', () => {
    getUser(req, res, (err) => {
      expect(err).toBeFalsy();
    });
    const data = res._getData();

    expect(data).toMatchObject({ user: {} });
  });
});

describe('Получает список фильмов', () => {
  const res = httpMocks.createResponse();
  const req = httpMocks.createRequest({
    method: 'GET',
    url: '/movies',
  });

  test.skip('Возвращает статус 200', () => {
    getMovies(req, res, (err) => {
      expect(err).toBeFalsy();
    });

    expect(res.statusCode).toBe(200);
  });

  test.skip('В ответе приходит массив', () => {
    getMovies(req, res, (err) => {
      expect(err).toBeFalsy();
    });
    const data = res._getData();

    expect(data).toEqual(expect.arrayContaining([]));
  });
});
