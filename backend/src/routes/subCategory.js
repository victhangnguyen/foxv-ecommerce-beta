import express from 'express';
import * as subCategoryController from '../controllers/subCategory.js';
//! imp Middleware: Validations
import { validateSchema } from '../middleware/validator.js';
import {
  createSubCategorySchema,
  updateSubCategorySchema,
} from '../middleware/schemaValidations/index.js';
//! imp Middleware: Passport
import { isAdmin, isUser } from '../middleware/passport/index.js';

const router = express.Router();
//! @desc     Fetch a SubCategory by slug
//! @route    GET /api/categories/:slug
//! @access   Private/Public
router.get(
  '/subcategories/slug/:slug',
  subCategoryController.getSubCategoryBySlug
);

//! @desc     Fetch SubCategories by categoryId
//! @route    GET /api/category/subs/:categoryId
//! @access   Private/Public
router.get(
  '/subcategories/category/:categoryId',
  subCategoryController.getSubCategoriesByCategoryId
);

//! @desc     Fetch all SubCategories
//! @route    GET /api/products
//! @access   Private/Public
router.get('/subcategories', subCategoryController.getSubCategories);

//! @desc     Fetch all of SubCategories by Filters
//! @route    GET /api/subcategories/search/filters
//! @access   Public
router.get(
  '/subcategories/search/filters',
  subCategoryController.getSubCategoriesByFilters
);

//! @desc     Create a new SubCategory
//! @route    POST /api/admin/subcategories/create
//! @access   Private: Admin
router.post(
  '/admin/subcategories/create',
  validateSchema(createSubCategorySchema),
  isAdmin,
  subCategoryController.createSubCategory
);

//! @desc     Update Info a SubCategory
//! @route    PUT /api/admin/subcategories/slug/:slug/update-info
//! @access   Private: Admin
router.put(
  '/admin/subcategories/slug/:slug/update-info',
  validateSchema(updateSubCategorySchema),
  isAdmin,
  subCategoryController.updateSubCategoryBySlug
);

//! @desc     Delete a SubCategory by Slug
//! @route    DEL /api/admin/subcategories/slug/:slug/delete
//! @access   Private: Admin
router.delete(
  '/admin/subcategories/slug/:slug/delete',
  isAdmin,
  subCategoryController.deleteSubCategoryBySlug
);

export default router;
