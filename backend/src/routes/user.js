import express from 'express';
import * as userController from '../controllers/user.js';

//! imp Middlewares
import { validateSchema } from '../middlewares/validator.js';

const router = express.Router();

//! @desc     Fetch all products by Filters
//! @route    GET /search/filters
//! @access   Private/Public
router.get('/users/search/filters', userController.fetchUsersByFilters);

//! @desc     Delete one User
//! @route    DEL /api/users/:userId
//! @access   Private: Admin
router.delete(
  '/users/:userId',
  userController.removeUser
);

export default router;
