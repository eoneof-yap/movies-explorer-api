import { celebrate, Joi } from 'celebrate';

const idConfig = Joi.string().hex().length(24).alphanum();
const userNameConfig = Joi.string().required().min(2).max(30);
const emailConfig = Joi.string().required().email();
const passwordConfig = Joi.string().required();

export const validateId = celebrate({
  body: Joi.object().keys({
    id: idConfig,
  }),
});

export const validateUserCredentials = celebrate({
  body: Joi.object().keys({
    name: userNameConfig,
    email: emailConfig,
    password: passwordConfig,
  }),
});

export const validateUserInfo = celebrate({
  body: Joi.object().keys({
    id: idConfig,
    name: userNameConfig,
    email: emailConfig,
  }),
});
