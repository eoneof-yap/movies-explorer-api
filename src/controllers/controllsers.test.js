import httpMocks from 'node-mocks-http';
import { describe, test, expect } from '@jest/globals';

import { getUserInfo, getMovieList } from './controllers.js';

describe('Получает данные о пользователе', () => {
  const res = httpMocks.createResponse();
  const req = httpMocks.createRequest({
    method: 'GET',
    url: '/users/me',
  });

  test('Возвращает статус 200', () => {
    getUserInfo(req, res, (err) => {
      expect(err).toBeFalsy();
    });

    expect(res.statusCode).toBe(200);
  });

  test('Объект пользователя соответствует', () => {
    getUserInfo(req, res, (err) => {
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

  test('Возвращает статус 200', () => {
    getMovieList(req, res, (err) => {
      expect(err).toBeFalsy();
    });

    expect(res.statusCode).toBe(200);
  });

  test('В ответе приходит массив', () => {
    getMovieList(req, res, (err) => {
      expect(err).toBeFalsy();
    });
    const data = res._getData();

    expect(data).toEqual(expect.arrayContaining([]));
  });
});
