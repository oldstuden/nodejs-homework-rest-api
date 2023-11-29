import express from 'express';
import authController from '../../controllers/auth-controller.js';
import { isEmptyBody } from '../../middlewares/index.js';
import { validateBodyWrapper } from '../../decorators/index.js';
import { userSigninSchema, userSignupSchema } from '../../models/User.js';

const authRouter = express.Router();

authRouter.post(
  '/signup',
  isEmptyBody,
  validateBodyWrapper(userSignupSchema),
  authController.signup
);
authRouter.post(
  '/signin',
  isEmptyBody,
  validateBodyWrapper(userSigninSchema),
  authController.signin
);

export default authRouter;
