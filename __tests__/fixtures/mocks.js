import { expect } from '@jest/globals';

export const loginPayload = {
  email: 'fake@email.com',
  password: 'FakePassword-123',
};

export const userPayload = {
  name: 'Fake Name',
  email: 'fake@email.com',
  password: 'FakePassword-123',
};

export const wrongEmailPayload = {
  email: 'wrong@email.com',
  password: 'FakePassword-123',
};

export const wrongPasswordPayload = {
  email: 'fake@email.com',
  password: 'WrongPassword-456',
};

export const invalidUserPayload = {
  name: 14739433,
  email: 'invalid-email',
  password: 94668060,
};

export const longUserPayload = {
  name: 'Really Long Fake Name Provided To Test Proper Joi Validation Handling',
  email: 'reallylongfakeemaiusername@reallylonghostingprovider.reallylongdomain',
  password: 'FakePassword-123',
};

export const editedUserPayload = {
  name: 'Change Name',
  email: 'change@email.com',
};

export const expectedUserPayload = {
  name: 'Fake Name',
  email: 'fake@email.com',
  _id: expect.any(String),
};

export const moviePayload = {
  movieId: '634214006c025e0ffe6aab46',
  nameEN: 'Fakin fake',
  nameRU: 'Фейкин фейк',
  year: '1970',
  country: 'Fakestan',
  director: 'Fake Faker',
  duration: 0,
  description: 'faker fakes fakin fakes faking fakes',
  image: 'https://website.com/fake-image.jpg',
  trailer: 'https://website.com/fake-trailer.mp4',
  thumbnail: 'https://website.com/fake-thumb.jpg',
  owner: '634214006c025e0ffe6aab46',
};

export const expectedMoviePayload = {
  _id: expect.any(String),
  movieId: expect.any(String),
  nameEN: 'Fakin fake',
  nameRU: 'Фейкин фейк',
  year: '1970',
  country: 'Fakestan',
  director: 'Fake Faker',
  duration: expect.any(Number),
  description: 'faker fakes fakin fakes faking fakes',
  image: 'https://website.com/fake-image.jpg',
  trailer: 'https://website.com/fake-trailer.mp4',
  thumbnail: 'https://website.com/fake-thumb.jpg',
  owner: expect.any(String),
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
