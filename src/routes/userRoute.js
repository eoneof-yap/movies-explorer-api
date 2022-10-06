import express from 'express';

import { CURRENT_USER_PATH } from '../utils/constants.js';
import { getUser, updateUser } from '../controllers/userController.js';

const userRoute = express();

userRoute.get(CURRENT_USER_PATH, getUser)
  .patch(CURRENT_USER_PATH, updateUser);

export default userRoute;
