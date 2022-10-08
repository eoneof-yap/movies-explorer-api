import supertest from 'supertest';

import {
  describe, test, expect, jest, beforeAll, afterAll,
} from '@jest/globals';

import * as db from './utils/virtualMongoServer.js';
import { payload, expectedPayload, editedPayload } from './fixtures/mocks.js';
import { CURRENT_USER_PATH, MOVIES_PATH, REGISTER_PATH } from '../src/utils/constants.js';
import app from '../src/app.js';

jest.setTimeout(30000);
const request = supertest(app);

beforeAll(async () => {
  await db.connect();
});

afterAll(async () => {
  await db.clearDatabase();
  await db.closeDatabase();
});

describe('Пользователь', () => {
  describe('Регистрация', () => {
    test('Создает пользователя и возвращает статус 201 (POST /signup', async () => {
      const response = await request
        .post(REGISTER_PATH).send(payload)
        .set('Content-Type', 'application/json');

      const data = response.toJSON();
      expect(data.status).toBe(201);

      process.env.USER = data.text; // put returned value to the global scope
    });

    test('Созданный объект пользователя соответствует переданному (POST /signup', async () => {
      expect(JSON.parse(process.env.USER)).toEqual(expectedPayload);
    });
  });

  describe('Данные пользователя', () => {
    test('Находит пользователя по ID  (GET /users/me)', async () => {
      const user = JSON.parse(process.env.USER);

      const response = await request
        .get(CURRENT_USER_PATH).send({ id: user._id })
        .set('Content-Type', 'application/json');

      const searchData = response.toJSON();
      const instance = JSON.parse(searchData.text);

      expect(instance._id).toEqual(user._id);
    });

    test('Обновляет имя и почту (PATCH /users/me)', async () => {
      const user = JSON.parse(process.env.USER);

      const response = await request
        .patch(CURRENT_USER_PATH).send({
          id: user._id,
          name: editedPayload.name,
          email: editedPayload.email,
        })
        .set('Content-Type', 'application/json');

      const searchData = response.toJSON();
      const instance = JSON.parse(searchData.text);

      expect(instance.name).toEqual(editedPayload.name);
      expect(instance.email).toEqual(editedPayload.email);
    });
  });
});

describe('Фильмы', () => {
  test.todo('Cоздаёт фильм с переданными в теле country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId (POST /movies)');

  test.skip('Получает список фильмов (GET /movies)', async () => {
    const response = await request
      .get(MOVIES_PATH);

    const data = response.toJSON();
    expect(data.status).toBe(201);
  });

  test.skip('В ответе приходит массив (GET /movies)', async () => {
    expect(/* data */).toEqual(expect.arrayContaining([]));
  });

  test.todo('Удаляет сохранённый фильм по id (DELETE /movies/_id)');
});
