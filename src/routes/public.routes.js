import express from 'express';

import { REGISTER_PATH, LOGIN_PATH } from '../utils/constants.js';

import { validateRegister, validateLogin } from '../middlewares/validators.js';
import { createUser, login } from '../controllers/user.controller.js';

const publicRouter = express.Router();

publicRouter.post(REGISTER_PATH, validateRegister, createUser)
  .post(LOGIN_PATH, validateLogin, login);

export default publicRouter;
