import supertest from 'supertest';
import {
  describe, test, expect, jest, beforeAll, afterAll, afterEach,
} from '@jest/globals';
import * as db from '../utils/MongoMemoryServer.js';

import { REGISTER_PATH } from '../utils/constants.js';
import app from '../app.js';

const request = supertest(app);
jest.setTimeout(30000);

const payload = {
  name: 'test',
  email: 'test@test.com',
  password: 'test123test',
};

describe('POST /signup', () => {
  beforeAll(async () => {
    await db.connect();
  });
  afterEach(async () => {
    await db.clearDatabase();
  });
  afterAll(async () => {
    await db.closeDatabase();
  });

  test('Статус 201', async () => {
    const response = await request.post(REGISTER_PATH)
      .send(payload).set('Content-Type', 'application/json');
    const res = response.toJSON();
    // console.log(res);
    expect(res.status).toBe(201);
  });

  test('Объект содержит', async () => {
    const response = await request.post(REGISTER_PATH).send({
      name: 'test',
      email: 'test@test.com',
      password: 'test123test',
    });
    const res = response.toJSON();
    expect(JSON.parse(res.text)).toEqual({
      name: expect.any(String),
      email: expect.any(String),
      password: expect.any(String),
      _id: expect.any(String),
      __v: expect.any(Number),
    });
  });
});
