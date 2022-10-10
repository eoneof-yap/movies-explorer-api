import express from 'express';

import { REGISTER_PATH, LOGIN_PATH } from '../utils/constants.js';
import { createUser, login } from '../controllers/userController.js';
import { validateRegister, validateLogin } from '../middlewares/validators.js';

const authRoute = express();

authRoute.post(REGISTER_PATH, validateRegister, createUser)
  .post(LOGIN_PATH, validateLogin, login);

export default authRoute;
