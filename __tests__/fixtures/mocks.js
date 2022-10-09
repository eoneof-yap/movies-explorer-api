import { expect } from '@jest/globals';

export const userPayload = {
  name: 'fake',
  email: 'fake@fake.com',
  password: 'fakePassword123',
};

export const editedUserPayload = {
  name: 'fake user',
  email: 'fake.email@fake-server.com',
};

export const expectedUserPayload = {
  name: 'fake',
  email: 'fake@fake.com',
  // TODO: hide password and '__v'
  password: expect.any(String),
  _id: expect.any(String),
  __v: expect.any(Number),
};

export const moviePayload = {
  country: 'Fakestan',
  director: 'Fake Faker',
  duration: '000',
  year: '1970',
  description: 'faker fakes kafing fakes faking fakes',
  image: 'https://fake.com/fake.jpg',
  trailer: 'https://fake.com/fake.mp4',
  nameRU: 'Фейкин фейк',
  nameEN: 'Fakin\' fake',
  thumbnail: 'https://fake.com/fake-thunb.jpg',
  movieId: '1234567890',
};

export const expectedMoviePayload = {
  country: 'Fakestan',
  director: 'Fake Faker',
  duration: '000',
  year: '1970',
  description: 'faker fakes kafing fakes faking fakes',
  image: 'https://fake.com/fake.jpg',
  trailer: 'https://fake.com/fake.mp4',
  nameRU: 'Фейкин фейк',
  nameEN: 'Fakin\' fake',
  thumbnail: 'https://fake.com/fake-thunb.jpg',
  movieId: '1234567890',
};
