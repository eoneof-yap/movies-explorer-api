import express from 'express';
import { errors } from 'celebrate';

import { CURRENT_USER_PATH } from '../utils/constants.js';
import { getUser, updateUser } from '../controllers/userController.js';
import { validateId, validateUserInfo } from '../middlewares/validators.js';

const userRoute = express();

userRoute.get(CURRENT_USER_PATH, validateId, getUser)
  .patch(CURRENT_USER_PATH, validateUserInfo, updateUser);

userRoute.use(errors());

export default userRoute;
