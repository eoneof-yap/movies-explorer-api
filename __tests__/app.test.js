import {
  describe, test, expect, jest, beforeAll, afterAll, afterEach,
} from '@jest/globals';
import supertest from 'supertest';

import * as db from './__utils__/virtualMongoServer.js';
import { REGISTER_PATH } from '../src/utils/constants.js';
import app from '../src/app.js';

jest.setTimeout(30000);
const request = supertest(app);

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
