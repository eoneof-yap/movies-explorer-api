import express from 'express';

import { REGISTER_PATH, LOGIN_PATH } from '../utils/constants.js';
import { createUser, login } from '../controllers/userController.js';
import { validateUserCredentials } from '../middlewares/validators.js';

const authRoute = express();

authRoute.post(REGISTER_PATH, validateUserCredentials, createUser)
  .post(LOGIN_PATH, validateUserCredentials, login);

export default authRoute;
