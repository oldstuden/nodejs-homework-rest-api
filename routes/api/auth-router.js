import express from 'express';
import authController from '../../controllers/auth-controller.js';
import { isEmptyBody } from '../../middlewares/index.js';
import { validateBodyWrapper } from '../../decorators/index.js';
import { userSignupSchema } from '../../models/User.js';

const authRouter = express.Router();

authRouter.post(
  '/signup',
  validateBodyWrapper(userSignupSchema),
  authController.signup
);

export default authRouter;
