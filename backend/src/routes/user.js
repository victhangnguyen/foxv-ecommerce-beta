import express from "express";
import * as userController from "../controllers/user.js";
//! imp Middleware: Validations
import { validateSchema } from "../middleware/validator.js";
import {
  updatePasswordByAdminSchema,
  updatePasswordByUserSchema,
  updateUserInfoSchema,
} from "../middleware/schemaValidations/index.js";
//! imp Middleware: Passport
import { authenticate, isAdmin, isUser } from "../middleware/passport/index.js";

const router = express.Router();

//! @desc     Fetch one User
//! @route    GET /api/users/:userId
//! @access   Public
router.get("/users/:userId", userController.getUserById);

//! @desc     Fetch all users by Filters
//! @route    GET /api/users/search/filters
//! @access   Public
router.get("/users/search/filters", userController.getUsersByFilters);

//! @desc     Create a new user
//! @route    POST /api/admin/users/create
//! @access   Private: Admin
router.post(
  "/admin/users/create",
  authenticate,
  isAdmin,
  userController.createUser
);

//! @desc     Delete Multitple User
//! @route    DEL /api/admin/users/delete-multiple'
//! @access   Private: Admin
router.delete(
  "/admin/users/delete-multiple",
  authenticate,
  isAdmin,
  userController.deleteUsers
);

//! @desc     Update one Info User
//! @route    PUT /api/admin/users/:userId/update-info
//! @access   Private: Admin
router.put(
  "/users/:userId/update",
  authenticate,
  isUser,
  validateSchema(updateUserInfoSchema),
  userController.updateUser
);

//! @desc     Update one Password By Admin
//! @route    PUT /api/admin/users/:userId/update-password
//! @access   Private: Admin
router.put(
  "/admin/users/:userId/update-password",
  authenticate,
  isAdmin,
  validateSchema(updatePasswordByAdminSchema),
  userController.updatePasswordByAdmin
);

//! @desc     Update one Password By User
//! @route    PUT /api/users/:userId/update-password
//! @access   Private: User
router.put(
  "/users/:userId/update-password",
  authenticate,
  isUser, //! hasUser
  validateSchema(updatePasswordByUserSchema),
  userController.updatePasswordByUser
);

//! @desc     Reset Password Multiple user
//! @route    PUT /api/amin/users/password/reset-multiple
//! @access   Private: Admin
router.put(
  "/admin/users/password/reset-multiple",
  authenticate,
  isAdmin,
  userController.resetPasswords
);

//! @desc     Update the user's Roles
//! @route    GET /api/admin/users/:userId/
//! @access   Private: Admin
router.put(
  "/admin/users/:userId/update-role",
  authenticate,
  isAdmin,
  userController.updateRole
);

export default router;
