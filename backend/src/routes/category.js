import express from 'express';
import * as categoryController from '../controllers/category.js';
//! imp Middleware: Validations
import { validateSchema } from '../middleware/validator.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../middleware/schemaValidations/index.js';
//! imp Middleware Passport
import { isAdmin, isUser } from '../middleware/passport/index.js';

const router = express.Router();
//! @desc     Fetch a Category by slug
//! @route    GET /api/categories/:slug
//! @access   Private/Public
router.get('/categories/slug/:slug', categoryController.getCategoryBySlug);

//! @desc     Fetch all Categories
//! @route    GET /api/categories
//! @access   Public
router.get('/categories', categoryController.getCategories);

//! @desc     Create a new Category
//! @route    POST /api/admin/categories/create
//! @access   Private: Admin

router.post(
  '/admin/categories/create',
  validateSchema(createCategorySchema),
  isAdmin,
  categoryController.createCategory
);

//! @desc     Update a Category by Slug
//! @route    PUT /api/admin/categories/:slug/update
//! @access   Private: Admin
router.put(
  '/admin/categories/slug/:slug/update-info',
  validateSchema(updateCategorySchema),
  isAdmin,
  categoryController.updateCategoryBySlug
);

//! @desc     Delete a Category by Slug
//! @route    DEL /api/admin/categories/:slug/delete
//! @access   Private: Admin
router.delete(
  '/admin/categories/slug/:slug/delete',
  isAdmin,
  categoryController.deleteCategoryBySlug
);

export default router;
