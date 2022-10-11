import { expect } from '@jest/globals';

export const loginPayload = {
  email: 'fake@fake.com',
  password: 'fakepassword123',
};

export const userPayload = {
  name: 'fake',
  email: 'fake@fake.com',
  password: 'fakePassword123',
};

export const wrongEmailPayload = {
  email: 'wrong-email@fake.com',
  password: 'fakePassword123',
};

export const wrongPasswordPayload = {
  email: 'fake@fake.com',
  password: 'wrong-password',
};

export const invalidUserPayload = {
  name: 123,
  email: 'fakefake',
  password: '',
};

export const longUserPayload = {
  name: 'fakefakefakefakefakefakefakefakefakefakefakefakefakefakefakefakefakefakefakefakefakefakefakefakefakefakefake',
  email: 'fakefakefakefakefakefakefakefakefakefakefakefakefake@fakefakefakefakefakefakefakefakefakefakefakefakefake.com',
  password: 'fakePassword123',
};

export const editedUserPayload = {
  name: 'fake user',
  email: 'fake.email@fake-server.com',
};

export const expectedUserPayload = {
  name: 'fake',
  email: 'fake@fake.com',
  _id: expect.any(String),
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

export const shortIdPayload = {
  id: '123',
  name: editedUserPayload.name,
  email: editedUserPayload.email,
};

export const nonHexIdPayload = {
  id: 'zxcvbnmasdfghjklqwertyui',
  name: editedUserPayload.name,
  email: editedUserPayload.email,
};

export const nonExistantIdPayload = {
  id: '634214006c025e0ffe6aab46',
  name: editedUserPayload.name,
  email: editedUserPayload.email,
};
