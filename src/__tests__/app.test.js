import supertest from 'supertest';
import {
  describe, test, expect, jest,
} from '@jest/globals';

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
  test('Статус 201', async () => {
    const response = await request.post(REGISTER_PATH)
      .send(payload).set('Content-Type', 'application/json');
    const res = response.toJSON();
    console.log(res);
    expect(res.status).toBe(201);
  });

  // test('Объект содержит', async (done) => {
  //   const response = await request.post(REGISTER_PATH).send({
  //     name: 'test',
  //     email: 'test@test.com',
  //     password: 'test123test',
  //   });
  //   expect(response.data).toEqual({
  //     name: expect.any(String),
  //     email: expect.any(String),
  //     password: expect.any(String),
  //   });
  //   done();
  // });
});
