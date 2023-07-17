import express from 'express';
import * as categoryController from '../controllers/category.js';
//! imp Middleware: Validations
import { validateSchema } from '../middleware/validator.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../middleware/schemaValidations/index.js';
//! imp Middleware Passport
import { isAdmin, authenticate } from '../middleware/passport/index.js';

const router = express.Router();

//! @desc     Fetch a Category by Id
//! @route    GET /api/categories/:categoryId
//! @access   Private/Public
router.get('/categories/:categoryId', categoryController.getCategoryById);

//! @desc     Fetch a Category by Slug
//! @route    GET /api/categories/:slug
//! @access   Private/Public
router.get('/categories/slug/:slug', categoryController.getCategoryBySlug);

//! @desc     Fetch all Categories
//! @route    GET /api/categories
//! @access   Public
router.get('/categories', categoryController.getCategories);

//! @desc     Fetch all of Categories by Filters
//! @route    GET /api/categories/search/filters
//! @access   Public
router.get(
  '/categories/search/filters',
  categoryController.getCategoriesByFilters
);

//! @desc     Create a new Category
//! @route    POST /api/admin/categories/create
//! @access   Private: Admin
router.post(
  '/admin/categories/create',
  validateSchema(createCategorySchema),
  authenticate,
  isAdmin,
  categoryController.createCategory
);

//! @desc     Update a Category by Id
//! @route    PUT /api/admin/categories/:categoryId/update
//! @access   Private: Admin
router.put(
  '/admin/categories/:categoryId/update',
  validateSchema(updateCategorySchema),
  authenticate,
  isAdmin,
  categoryController.updateCategoryById
);

//! @desc     Update a Category by Slug
//! @route    PUT /api/admin/categories/:slug/update
//! @access   Private: Admin
router.put(
  '/admin/categories/slug/:slug/update',
  validateSchema(updateCategorySchema),
  authenticate,
  isAdmin,
  categoryController.updateCategoryBySlug
);

//! @desc     Delete a Category by Id
//! @route    DEL /api/admin/categories/delete-single
//! @access   Private: Admin
router.delete(
  '/admin/categories/delete-single',
  authenticate,
  isAdmin,
  categoryController.deleteCategoryById
);

//! @desc     Delete a Category by Slug
//! @route    DEL /api/admin/categories/:slug/delete
//! @access   Private: Admin
router.delete(
  '/admin/categories/slug/:slug/delete',
  authenticate,
  isAdmin,
  categoryController.deleteCategoryBySlug
);

export default router;
