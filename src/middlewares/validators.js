import { celebrate, Joi } from 'celebrate';

// common config
const validUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/i;
const validRequiredString = Joi.string().required();
const validMovieId = Joi.number().required();
const validRequiredNumber = Joi.number().required();
const validId = Joi.string().alphanum().length(24).required()
  .hex();

export const validateId = celebrate({
  params: Joi.object({
    id: validId,
  }),
});

// user data config
const validUserName = Joi.string().required().min(2).max(30);
const validEmail = Joi.string().required().email();
const validPassword = Joi.string().required();

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
    name: validUserName,
    email: validEmail,
  }),
});

export const validateMovieInfo = celebrate({
  body: Joi.object().keys({
    movieId: validMovieId,
    nameEN: validRequiredString,
    nameRU: validRequiredString,
    director: validRequiredString,
    country: validRequiredString,
    year: validRequiredString,
    duration: validRequiredNumber,
    description: validRequiredString,
    trailerLink: validUrl,
    image: validUrl,
    thumbnail: validUrl,
  }),
});
