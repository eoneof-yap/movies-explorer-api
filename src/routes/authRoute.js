import express from 'express';

import { USER_PATH } from '../utils/constants.js';
import { createUser, login } from '../controllers/userController.js';

const authRoute = express();

authRoute.post(USER_PATH, createUser)
  .post(USER_PATH, login);

export default authRoute;
