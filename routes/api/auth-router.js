import express from 'express';
import authController from '../../controllers/auth-controller.js';
import {
  authentication,
  isEmptyBody,
  upload,
} from '../../middlewares/index.js';
import { validateBodyWrapper } from '../../decorators/index.js';
import { userSigninSchema, userSignupSchema } from '../../models/User.js';

const authRouter = express.Router();

authRouter.post(
  '/register',
  isEmptyBody,
  validateBodyWrapper(userSignupSchema),
  authController.register
);

authRouter.post(
  '/login',
  isEmptyBody,
  validateBodyWrapper(userSigninSchema),
  authController.login
);

authRouter.get('/current', authentication, authController.current);

authRouter.post('/logout', authentication, authController.logout);

authRouter.patch(
  '/avatars',
  authentication,
  upload.single('avatarURL'),
  authController.updateAvatar
);

export default authRouter;
