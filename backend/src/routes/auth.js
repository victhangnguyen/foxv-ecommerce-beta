import express from 'express';

//! imp Ctrls
import * as authController from '../controllers/auth.js';

//! imp middleware
import { validateSchema } from '../middleware/validator.js';
import {
  signupSchema,
  signinSchema,
} from '../middleware/schemaValidations/index.js';

const router = express.Router();

router.post(
  '/auth/signup',
  validateSchema(signupSchema),
  authController.signup
);

router.post(
  '/auth/signin',
  validateSchema(signinSchema),
  authController.signin
);

router.post('/auth/refresh-token', authController.refreshToken)

export default router;
