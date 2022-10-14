import { celebrate, Joi } from 'celebrate';

// common config
const validUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/i;
const validRequiredString = Joi.string().required();
const validId = Joi.string().hex().length(24).alphanum();
const validnumber = Joi.number();

// user data config
const validUserName = Joi.string().required().min(2).max(30);
const validEmail = Joi.string().required().email();
const validPassword = Joi.string().required().min(8);

export const validateId = celebrate({
  body: Joi.object().keys({
    id: validId,
  }),
});

export const validateRegister = celebrate({
  body: Joi.object().keys({
    name: validUserName,
    email: validEmail,
    password: validPassword,
  }),
});

export const validateLogin = celebrate({
  body: Joi.object().keys({
    email: validEmail,
    password: validPassword,
  }),
});

export const validateUpdate = celebrate({
  body: Joi.object().keys({
    id: validId,
    name: validUserName,
    email: validEmail,
  }),
});

export const validateMovieInfo = celebrate({
  body: Joi.object().keys({
    country: validRequiredString,
    director: validRequiredString,
    duration: validnumber,
    year: validRequiredString,
    description: validRequiredString,
    image: validUrl,
    trailer: validUrl,
    thumbnail: validUrl,
    owner: validId,
    movieId: validId,
    nameRU: validRequiredString,
    nameEN: validRequiredString,
  }),
});
