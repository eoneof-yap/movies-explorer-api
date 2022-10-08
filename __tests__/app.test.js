import supertest from 'supertest';

import {
  describe, test, expect, jest, beforeAll, afterAll, afterEach,
} from '@jest/globals';

import * as db from './__utils__/virtualMongoServer.js';
import { CURRENT_USER_PATH, REGISTER_PATH } from '../src/utils/constants.js';
import app from '../src/app.js';

jest.setTimeout(30000);
const request = supertest(app);

const payload = {
  name: 'test',
  email: 'test@test.com',
  password: 'test123test',
};

const editedPayload = {
  name: 'testtest2',
  email: 'testtest2@test.com',
};

const expectedPayload = {
  name: 'test',
  email: 'test@test.com',
  // TODO: hide password and '__v'
  password: 'test123test',
  _id: expect.any(String),
  __v: expect.any(Number),
};

beforeAll(async () => {
  await db.connect();
});
afterEach(async () => {
  await db.clearDatabase();
});
afterAll(async () => {
  await db.closeDatabase();
});

describe('Пользователь', () => {
  describe('Регистрация', () => {
    test('Возвращает статус 201 (POST /signup', async () => {
      const response = await request
        .post(REGISTER_PATH).send(payload)
        .set('Content-Type', 'application/json');

      const data = response.toJSON();

      expect(data.status).toBe(201);
    });

    test('Созданный объект пользователя соответствует переданному (POST /signup', async () => {
      const response = await request
        .post(REGISTER_PATH).send(payload)
        .set('Content-Type', 'application/json');

      const data = response.toJSON();

      expect(JSON.parse(data.text)).toEqual(expectedPayload);
    });
  });

  describe('Данные пользователя', () => {
    test('Находит пользователя по ID  (GET /users/me)', async () => {
      const createResponse = await request
        .post(REGISTER_PATH).send(payload)
        .set('Content-Type', 'application/json');

      const createdData = createResponse.toJSON();
      const user = JSON.parse(createdData.text);

      const searchResponse = await request
        .get(CURRENT_USER_PATH).send({ id: user._id })
        .set('Content-Type', 'application/json');

      const searchData = searchResponse.toJSON();
      const instance = JSON.parse(searchData.text);

      expect(instance._id).toEqual(user._id);
    });

    test('Обновляет имя и почту  (PATCH /users/me)', async () => {
      const createResponse = await request
        .post(REGISTER_PATH).send(payload)
        .set('Content-Type', 'application/json');

      const createdData = createResponse.toJSON();
      const user = JSON.parse(createdData.text);

      const searchResponse = await request
        .patch(CURRENT_USER_PATH).send({
          id: user._id,
          name: editedPayload.name,
          email: editedPayload.email,
        })
        .set('Content-Type', 'application/json');

      const searchData = searchResponse.toJSON();
      const instance = JSON.parse(searchData.text);

      expect(instance.name).toEqual(editedPayload.name);
      expect(instance.email).toEqual(editedPayload.email);
    });
  });
});
