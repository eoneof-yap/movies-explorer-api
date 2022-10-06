import supertest from 'supertest';
import { describe, test, expect } from '@jest/globals';

import { REGISTER_PATH } from '../utils/constants.js';
import app from '../app.js';

const request = supertest(app);

describe('POST /users', () => {
  test('Статус 201', () => {
    request.post(REGISTER_PATH).send({
      name: 'test',
      email: 'test@test.com',
      password: 'test123test',
    })
      .then((response) => {
        console.log(response);
        expect(response.statusCode).toBe(201);
      });

    // test('Статус 201', () => {
    //   jest.setTimeout(15000);
    //   const response = request.post(REGISTER_PATH).send({
    //     name: 'test',
    //     email: 'test@test.com',
    //     password: 'test123test',
    //   });
    //   expect(response.body).toEqual({
    //     name: expect.any(String),
    //     email: expect.any(String),
    //     password: expect.any(String),
    //   });
    // });
  });
});
