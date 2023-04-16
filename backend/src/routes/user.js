import express from 'express';
import * as userController from '../controllers/user.js';
//! imp Middleware: Validations
import { validateSchema } from '../middleware/validator.js';
import { updateUserPasswordSchema } from '../middleware/schemaValidations/index.js';
//! imp Middleware: Passport
import { authenticate, isAdmin, isUser } from '../middleware/passport/index.js';

const router = express.Router();

//! @desc     Fetch one User
//! @route    GET /api/users/:userId
//! @access   Public
router.get('/users/:userId', userController.getUser);

//! @desc     Fetch all users by Filters
//! @route    GET /api/users/search/filters
//! @access   Public
router.get('/users/search/filters', userController.getUsersByFilters);

//! @desc     Delete Multitple User
//! @route    DEL /api/admin/users/delete-multiple'
//! @access   Private: Admin
router.delete(
  '/admin/users/delete-multiple',
  authenticate,
  isAdmin,
  userController.deleteUsers
);

//! @desc     Update one Info User
//! @route    PUT /api/admin/users/:userId/update-info
//! @access   Private: Admin
router.put(
  '/admin/users/:userId/update-info',
  authenticate,
  isUser,
  userController.updateUserInfo
);

//! @desc     Update one Password User
//! @route    PUT /api/admin/users/:userId/update-password
//! @access   Private: Admin
router.put(
  '/admin/users/:userId/update-password',
  authenticate,
  isUser,
  validateSchema(updateUserPasswordSchema),
  userController.updateUserPassword
);

//! @desc     Reset Password Multiple user
//! @route    PUT /api/amin/users/password/reset-multiple
//! @access   Private: Admin
router.put(
  '/admin/users/password/reset-multiple',
  authenticate,
  isAdmin,
  userController.resetPasswords
);

//! @desc     Update the user's Roles
//! @route    GET /api/admin/users/:userId/
//! @access   Private: Admin
router.put(
  '/admin/users/:userId/update-role',
  authenticate,
  isAdmin,
  userController.updateRole
);

export default router;
