import { celebrate, Joi } from 'celebrate';

// common config
const validUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/i;
const validRequiredString = Joi.string().required();
const validUserId = Joi.string().hex().length(24).alphanum()
  .required();
const validMovieId = Joi.number().required();
const validnumber = Joi.number();

// user data config
const validUserName = Joi.string().required().min(2).max(30);
const validEmail = Joi.string().required().email();
const validPassword = Joi.string().required();

export const validateId = celebrate({
  body: Joi.object().keys({
    id: validUserId,
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
    id: validUserId,
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
    duration: validnumber,
    description: validRequiredString,
    trailerLink: validUrl,
    image: validUrl,
    thumbnail: validUrl,
    // get owner from cookies after authorization,
    // validate in movieSchema only
    owner: Joi.forbidden(),
  }),
});
