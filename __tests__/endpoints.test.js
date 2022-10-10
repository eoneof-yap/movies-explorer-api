/* eslint-disable no-console */
import supertest from 'supertest';

import {
  describe, test, expect, jest, beforeAll, beforeEach, afterEach, afterAll,
} from '@jest/globals';

import * as db from './utils/virtualMongoServer.js';
import {
  loginPayload, userPayload, invalidUserPayload,
  expectedUserPayload, editedUserPayload, longUserPayload,
  shortIdPayload, nonHexIdPayload, nonExistantIdPayload,
} from './fixtures/mocks.js';
import {
  CURRENT_USER_PATH, LOGIN_PATH, MOVIES_PATH, REGISTER_PATH,
} from '../src/utils/constants.js';
import app from '../src/app.js';

jest.setTimeout(30000);
const request = supertest(app);

const createUser = () => request.post(REGISTER_PATH).send(userPayload).set('Content-Type', 'application/json');
const createLongUser = () => request.post(REGISTER_PATH).send(longUserPayload).set('Content-Type', 'application/json');
const createInvalidUser = () => request.post(REGISTER_PATH).send(invalidUserPayload).set('Content-Type', 'application/json');
const createEmptyUser = () => request.post(REGISTER_PATH).send({}).set('Content-Type', 'application/json');
const getUser = (user) => request.get(CURRENT_USER_PATH).send({ id: user._id }).set('Content-Type', 'application/json');

const login = () => request.post(LOGIN_PATH).send(loginPayload).set('Content-Type', 'application/json');

const patchUser = (user) => request.patch(CURRENT_USER_PATH).send({
  id: user._id,
  name: editedUserPayload.name,
  email: editedUserPayload.email,
});

const patchShortId = () => request.patch(CURRENT_USER_PATH).send(shortIdPayload);
const patchNonHexId = () => request.patch(CURRENT_USER_PATH).send(nonHexIdPayload);
const patchNonExistandId = () => request.patch(CURRENT_USER_PATH).send(nonExistantIdPayload);

beforeAll(async () => {
  await db.connect();
});

beforeEach(() => {
  jest.spyOn(console, 'error');
  console.error.mockImplementation(() => null);
});

// restore console.error messages
afterEach(() => {
  console.error.mockRestore();
});

afterAll(async () => {
  // await db.clearDatabase();
  await db.closeDatabase();
});

describe('Общее', () => {
  test('Обращение по несуществующему пути возвращает статус 404 (GET /fake-path)', async () => {
    const response = await request.get('/fake-path');
    const data = response.toJSON();
    expect(data.status).toBe(404);
  });

  test.todo('Обращение к защищенному роуту без авторизации возвращает статус 401 (GET /users/me)');
  test.todo('Обращение к защищенному роуту без авторизации возвращает статус 401 (GET /movies)');
});

describe('Пользователь', () => {
  describe('Регистрация', () => {
    test('Создает пользователя и возвращает JSON и статус 201 (POST /signup)', async () => {
      const response = await createUser();
      const data = response.toJSON();
      expect(response.headers['content-type']).toMatch('application/json');
      expect(data.status).toBe(201);

      process.env.USER = data.text; // put returned value to the global scope
    });

    test('Попытка передать пустой объект возвращает статус 500 (POST /signup)', async () => {
      const response = await createEmptyUser();
      const data = response.toJSON();
      expect(data.status).toBe(500);
    });

    test('Попытка передать невалидные данные возвращает статус 400 (POST /signup)', async () => {
      const response = await createInvalidUser();
      const data = response.toJSON();
      expect(data.status).toBe(400);
    });

    test('Попытка передать слишком длинные строки возвращает статус 400 (POST /signup)', async () => {
      const response = await createLongUser();
      const { status } = response.toJSON();
      expect(status).toBe(400);
    });

    test('Попытка передать уже существующую почту возвращает статус 409 (POST /signup)', async () => {
      const response = await createUser();
      const { status } = response.toJSON();
      expect(status).toBe(409);
    });

    test('Созданный объект пользователя соответствует переданному (POST /signup)', async () => {
      expect(JSON.parse(process.env.USER)).toEqual(expectedUserPayload);
    });
  });

  describe('Данные пользователя', () => {
    test('Находит пользователя по ID (GET /users/me)', async () => {
      const user = JSON.parse(process.env.USER);
      const response = await getUser(user);
      const searchData = response.toJSON();
      const { _id } = JSON.parse(searchData.text);
      expect(response.headers['content-type']).toMatch('application/json');
      expect(response.ok).toBeTruthy();
      expect(_id).toEqual(user._id);
    });

    test('Обновляет имя и почту (PATCH /users/me)', async () => {
      const user = JSON.parse(process.env.USER);
      const response = await patchUser(user);
      const searchData = response.toJSON();
      const instance = JSON.parse(searchData.text);
      expect(response.headers['content-type']).toMatch('application/json');
      expect(response.ok).toBeTruthy();
      expect(instance.name).toEqual(editedUserPayload.name);
      expect(instance.email).toEqual(editedUserPayload.email);
    });

    test('Попытка передать невалидный id возвращает статус 400 (PATCH /users/me)', async () => {
      const response = await patchNonHexId();
      expect(response.status).toBe(400);
    });

    test('Попытка передать короткий id возвращает статус 400 (PATCH /users/me)', async () => {
      const response = await patchShortId();
      expect(response.status).toBe(400);
    });

    test('Попытка передать несуществующий id возвращает статус 404 (PATCH /users/me)', async () => {
      const response = await patchNonExistandId();
      expect(response.status).toBe(404);
    });
  });

  describe('Логин', () => {
    test('Логин  (POST /signin)', async () => {
      await createUser();
      const response = await login();
      const data = response.toJSON();
      const { token } = JSON.parse(data.text);
      expect(response.headers['content-type']).toMatch('application/json');
      expect(typeof token).toBe('string');
    });
  });
});

describe('Фильмы', () => {
  test.todo('Cоздаёт фильм с переданными в теле country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId (POST /movies)');

  test.skip('Получает список фильмов (GET /movies)', async () => {
    const response = await request.get(MOVIES_PATH);
    const data = response.toJSON();
    expect(data.status).toBe(201);
  });

  test.skip('В ответе приходит массив (GET /movies)', async () => {
    expect(/* data */).toEqual(expect.arrayContaining([]));
  });

  test.todo('Удаляет сохранённый фильм по id (DELETE /movies/_id)');
});
