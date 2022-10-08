import { expect } from '@jest/globals';

export const payload = {
  name: 'fake',
  email: 'fake@fake.com',
  password: 'fakePassword123',
};

export const editedPayload = {
  name: 'fake user',
  email: 'fake.email@fake-server.com',
};

export const expectedPayload = {
  name: 'fake',
  email: 'fake@fake.com',
  // TODO: hide password and '__v'
  password: 'fakePassword123',
  _id: expect.any(String),
  __v: expect.any(Number),
};
