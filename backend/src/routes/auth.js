import express from "express";

//! imp Ctrls
import * as authController from "../controllers/auth.js";

//! imp Middlewares
import { authenticate } from "../middleware/passport/index.js";
import { validateSchema } from "../middleware/validator.js";
import {
  signupSchema,
  signinSchema,
} from "../middleware/schemaValidations/index.js";

const router = express.Router();

router.post(
  "/auth/signup",
  validateSchema(signupSchema),
  authController.signup
);

router.post(
  "/auth/signin",
  validateSchema(signinSchema),
  authController.signin
);

router.post("/auth/refresh-token", authController.refreshToken);

router.post("/auth/forgot-password", authController.forgotPassword);

export default router;
