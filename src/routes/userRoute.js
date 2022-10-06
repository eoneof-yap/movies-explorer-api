import express from 'express';

import { USER_PATH } from '../utils/constants.js';
import { getUser, updateUser } from '../controllers/userController.js';

const userRoute = express();

userRoute.get(USER_PATH, getUser)
  .patch(USER_PATH, updateUser);

export default userRoute;
