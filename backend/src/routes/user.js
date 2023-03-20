import express from 'express';
import * as userController from '../controllers/user.js';
//! imp Middleware
import { isAdmin, isUser } from '../middleware/passport/index.js';
import { validateSchema } from '../middleware/validator.js';
import { updateUserPassword } from '../middleware/schemaValidations/index.js';

const router = express.Router();

//! @desc     Fetch one User
//! @route    GET /api/users/:userId
//! @access   Public
router.get('/users/:userId', userController.getUser);

//! @desc     Fetch all products by Filters
//! @route    GET /api/users/search/filters
//! @access   Public
router.get('/users/search/filters', userController.fetchUsersByFilters);

//! @desc     Delete Multitple User
//! @route    DEL /api/admin/users/delete-multiple'
//! @access   Private: Admin
router.delete(
  '/admin/users/delete-multiple',
  isAdmin,
  userController.deleteUsers
);

//! @desc     Update one Info User
//! @route    PUT /api/admin/users/:userId/update-info
//! @access   Private: Admin
router.put(
  '/admin/users/:userId/update-info',
  isUser,
  userController.updateUserInfo
);

//! @desc     Update one Password User
//! @route    PUT /api/admin/users/:userId/update-password
//! @access   Private: Admin
router.put(
  '/admin/users/:userId/update-password',
  isUser,
  validateSchema(updateUserPassword),
  userController.updateUserPassword
);

//! @desc     Reset Password Multiple user
//! @route    PUT /api/amin/users/password/reset-multiple
//! @access   Private: Admin
router.put(
  '/admin/users/password/reset-multiple',
  isAdmin,
  userController.resetPasswords
);

//! @desc     Update the user's Roles
//! @route    GET /api/admin/users/:userId/
//! @access   Private: Admin
router.put(
  '/admin/users/:userId/update-role',
  isAdmin,
  userController.updateRole
);

export default router;
