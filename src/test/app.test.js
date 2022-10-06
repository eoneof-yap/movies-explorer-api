import supertest from 'supertest';
import { describe, test, expect } from '@jest/globals';

import { REGISTER_PATH } from '../utils/constants.js';
import app from '../app.js';

describe('POST /users', () => {
  test('Статус 201', () => {
    const response = supertest(app).post(REGISTER_PATH).send({
      name: 'test',
      email: 'test@test.com',
      password: 'test123test',
    });
    expect(response.statusCode).toBe(201);
  });
});
