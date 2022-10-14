/* eslint-disable no-console */
import supertest from 'supertest';
import process from 'process';
import dotenv from 'dotenv';

import {
  describe, test, expect, jest, beforeAll, beforeEach, afterEach, afterAll,
} from '@jest/globals';

import * as db from './utils/virtualMongoServer.js';
import {
  loginPayload, userPayload, invalidUserPayload,
  expectedUserPayload, editedUserPayload, longUserPayload,
  shortIdPayload, nonHexIdPayload, nonExistantIdPayload, wrongPasswordPayload,
  wrongEmailPayload, moviePayload, expectedMoviePayload,
} from './fixtures/mocks.js';
import {
  CURRENT_USER_PATH, LOGIN_PATH, MOVIES_PATH, REGISTER_PATH,
} from '../src/utils/constants.js';
import app from '../src/app.js';

dotenv.config();

jest.setTimeout(15000);
const request = supertest(app);

const headers = {
  auth: 'Cookie',
  type: 'Content-type',
  value: 'application/json',
};

const createLongUser = () => request
  .post(REGISTER_PATH).send(longUserPayload).set(headers.type, headers.value);

const createInvalidUser = () => request
  .post(REGISTER_PATH).send(invalidUserPayload).set(headers.type, headers.value);

const createEmptyUser = () => request
  .post(REGISTER_PATH).send({}).set(headers.type, headers.value);

const createUser = async () => {
  const response = await request
    .post(REGISTER_PATH).send(userPayload).set(headers.type, headers.value);
  const data = response.toJSON();
  process.env.USER = data.text; // put returned value to the global scope
  return response;
};

const login = async () => {
  const response = await request
    .post(LOGIN_PATH).send(loginPayload).set(headers.type, headers.value);
  const data = response.toJSON();
  const cookies = data.header['set-cookie'];
  process.env.TOKEN = cookies;
  return response;
};

const invalidlogin = () => request
  .post(LOGIN_PATH).send(invalidUserPayload).set(headers.type, headers.value);

const wrongPasswordLogin = () => request
  .post(LOGIN_PATH).send(wrongPasswordPayload).set(headers.type, headers.value);

const wrongEmailLogin = () => request
  .post(LOGIN_PATH).send(wrongEmailPayload).set(headers.type, headers.value);

const getUser = (user) => request
  .get(CURRENT_USER_PATH).send({ id: user._id }).set(headers.type, headers.value);
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
afterEach(async () => {
  console.error.mockRestore();
});

afterAll(async () => {
  await db.clearDatabase();
  await db.closeDatabase();
});

describe('ОБЩЕЕ', () => {
  describe('/fake-path', () => {
    test('[GET] Обращение по несуществующему пути без авторизации возвращает статус 401 ', async () => {
      const response = await request
        .get('/fake-path');
      const data = response.toJSON();
      expect(data.status).toBe(401);
    });

    test('[GET] Обращение к роуту пользователя без авторизации возвращает статус 401 ', async () => {
      const response = await request
        .get(CURRENT_USER_PATH);
      const data = response.toJSON();
      expect(data.status).toBe(401);
    });
    test('[GET] Обращение к роуту фильмов без авторизации возвращает статус 401 ', async () => {
      const response = await request
        .get(MOVIES_PATH);
      const data = response.toJSON();
      expect(data.status).toBe(401);
    });
  });
});

describe('ПОЛЬЗОВАТЕЛЬ', () => {
  describe('/signup', () => {
    test('[POST] Создает пользователя и возвращает JSON и статус 201 ', async () => {
      const response = await createUser();
      const data = response.toJSON();
      expect(response.headers['content-type']).toMatch('application/json');
      expect(data.status).toBe(201);
    });

    test('[POST] Созданный объект пользователя соответствует переданному ', async () => {
      expect(JSON.parse(process.env.USER)).toEqual(expectedUserPayload);
    });

    test('[POST] В ответе нет полей "password" и "__v"', async () => {
      expect(JSON.parse(process.env.USER).password).toBeFalsy();
    });

    test('[POST] Попытка передать пустой объект возвращает статус 400', async () => {
      const response = await createEmptyUser();
      const data = response.toJSON();
      expect(data.status).toBe(400);
    });

    test('[POST] Попытка передать невалидные данные возвращает статус 400 ', async () => {
      const response = await createInvalidUser();
      const data = response.toJSON();
      expect(data.status).toBe(400);
    });

    test('[POST] Попытка передать слишком длинные строки возвращает статус 400 ', async () => {
      const response = await createLongUser();
      const { status } = response.toJSON();
      expect(status).toBe(400);
    });

    test('[POST] Попытка передать уже существующую почту возвращает статус 409 ', async () => {
      const response = await createUser();
      const { status } = response.toJSON();
      expect(status).toBe(409);
    });
  });

  describe('/signin', () => {
    test('[POST] Успешный вход возвращает статус 200 и куки ', async () => {
      await createUser();
      const response = await login();
      expect(response.headers['content-type']).toMatch('application/json');
      expect(response.status).toBe(200);
      expect(typeof process.env.TOKEN).toBe('string');
    });

    test('[POST] Неудачный вход возвращает статус 400', async () => {
      const response = await invalidlogin();
      expect(response.status).toBe(400);
    });

    test('[POST] Неверный email возвращает статус 403', async () => {
      const response = await wrongEmailLogin();
      expect(response.status).toBe(403);
    });

    test('[POST] Неверный пароль возвращает статус 403', async () => {
      const response = await wrongPasswordLogin();
      expect(response.status).toBe(403);

      await db.clearDatabase();
    });
  });

  describe('/users/me', () => {
    test('[GET] Находит пользователя по ID ', async () => {
      await createUser();
      await login();
      const user = JSON.parse(process.env.USER);
      const response = await getUser(user).set(headers.auth, process.env.TOKEN);
      const data = response.toJSON();
      const { _id } = JSON.parse(data.text);
      expect(response.headers['content-type']).toMatch('application/json');
      expect(response.ok).toBeTruthy();
      expect(_id).toEqual(user._id);
    });

    test('[PATCH] Обновляет имя и почту ', async () => {
      const user = JSON.parse(process.env.USER);
      const response = await patchUser(user).set(headers.auth, process.env.TOKEN);
      const data = response.toJSON();
      const instance = JSON.parse(data.text);
      expect(response.headers['content-type']).toMatch('application/json');
      expect(response.ok).toBeTruthy();
      expect(instance.name).toEqual(editedUserPayload.name);
      expect(instance.email).toEqual(editedUserPayload.email);
    });

    test('[PATCH] Попытка передать невалидный id возвращает статус 400 ', async () => {
      const response = await patchNonHexId().set(headers.auth, process.env.TOKEN);
      expect(response.status).toBe(400);
    });

    test('[PATCH] Попытка передать короткий id возвращает статус 400 ', async () => {
      const response = await patchShortId().set(headers.auth, process.env.TOKEN);
      expect(response.status).toBe(400);
    });

    test('[PATCH] Попытка передать несуществующий id возвращает статус 404 ', async () => {
      const response = await patchNonExistandId().set(headers.auth, process.env.TOKEN);
      expect(response.status).toBe(404);
    });

    test('[GET] Попытка перейти по несуществующему защищенному пути возвращает 404', async () => {
      const response = await request
        .get('/wrong-path').set(headers.auth, process.env.TOKEN);
      expect(response.status).toBe(404);
    });
  });
});

describe('ФИЛЬМЫ', () => {
  describe('/movies', () => {
    test('[POST] cоздаёт фильм с переданными в теле country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieid', async () => {
      await createUser();
      await login();
      const response = await request
        .post(MOVIES_PATH).send(moviePayload).set(headers.auth, process.env.TOKEN);
      const data = response.toJSON();
      const { _id } = JSON.parse(data.text);
      process.env.MOVIE_ID = _id;
      expect(JSON.parse(data.text)).toEqual(expectedMoviePayload);
      expect(data.status).toBe(201);
    });

    test('[GET] в ответе приходит массив ', async () => {
      const response = await request
        .get(MOVIES_PATH).set(headers.auth, process.env.TOKEN);
      const data = response.toJSON();
      expect(data.status).toBe(200);
      expect(JSON.parse(data.text)).toEqual(expect.arrayContaining([{ ...expectedMoviePayload }]));
    });
  });

  describe('/movies/id', () => {
    test('[DELETE] Попытка удалить несуществующий фильм возвращает статус 404', async () => {
      const response = await request
        .delete(`${MOVIES_PATH}/63441473536ee678ae43eea8`).set(headers.auth, process.env.TOKEN);
      const data = response.toJSON();
      expect(data.status).toBe(404);
    });
  });

  describe('/movies/id', () => {
    test('[DELETE] удаляет сохранённый фильм по id ', async () => {
      const response = await request
        .delete(`${MOVIES_PATH}/${process.env.MOVIE_ID}`).set(headers.auth, process.env.TOKEN);
      const data = response.toJSON();
      expect(data.status).toBe(200);
    });
  });
});
