import supertest from 'supertest';
import { describe, test, expect } from '@jest/globals';

import app from '../app.js';

const req = supertest(app);

describe('Эндпоинты отвечают', () => {
  test('Статус 200', () => req.get('/users/me').then((res) => {
    expect(res.status).toBe(200);
  }));
});
