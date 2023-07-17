import express from 'express';
import * as productController from '../controllers/product.js';
//! imp middleware
import uploadHandler from '../middleware/upload.js';
//! imp Validations
import { validateSchema } from '../middleware/validator.js';
import {
  createProductSchema,
  updateProductSchema,
} from '../middleware/schemaValidations/index.js';
import { authenticate, isAdmin } from '../middleware/passport/index.js';

const router = express.Router();

//! @desc     Fetch one Product by Id
//! @route    GET /api/products/:productId
//! @access   Public
router.get('/products/:productId', productController.getProductById);
//! @desc     Fetch one Product by slug

//! @route    GET /api/products/slug/:slug
//! @access   Public
router.get('/products/slug/:slug', productController.getProductBySlug);

//! @desc     Fetch all products with Pagination
//! @route    GET /api/products
//! @access   Public
router.get('/products', productController.getProductList);

//! @desc     Create a new Product
//! @route    POST /api/products
//! @access   Private: Admin
router.post(
  '/admin/products/create',
  authenticate,
  isAdmin,
  uploadHandler,
  validateSchema(createProductSchema),
  productController.createProduct
);

//! @desc     Delete One Product
//! @route    DEL /api/admin/products/delete-single
//! @access   Private: Admin
router.delete(
  '/admin/products/delete-single',
  authenticate,
  isAdmin,
  productController.deleteProductById
);

//! @desc     Delete Many Product(s)
//! @route    DEL /api/admin/products/delete-multiple
//! @access   Private: Admin
router.delete(
  '/admin/products/delete-multiple',
  authenticate,
  isAdmin,
  productController.deleteProductsByIds
);

//! @desc     Update one Product
//! @route    PUT /api/products/:productId
//! @access   Private
router.put(
  '/admin/products/:productId/update',
  authenticate,
  isAdmin,
  uploadHandler,
  validateSchema(updateProductSchema),
  productController.updateProductById
);

//! @desc     Search the product
//! @route    GET /api/products/search/filters
//! @access   Public
router.get('/products/search/filters', productController.getProductsByFilters);

export default router;
