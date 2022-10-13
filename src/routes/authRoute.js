import express from 'express';

import { REGISTER_PATH, LOGIN_PATH } from '../utils/constants.js';
import { createUser, login } from '../controllers/userController.js';

const authRoute = express();

authRoute.post(REGISTER_PATH, createUser)
  .post(LOGIN_PATH, login);

export default authRoute;
