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

//! @desc     Fetch Count of All Products
//! @route    GET /api/products/total
//! @access   Public
router.get('/products/total', productController.productsCount);

//! @desc     Fetch all products with Pagination
//! @route    GET /api/products
//! @access   Public
router.get('/products', productController.getProductList);

//! @desc     Fetch one Product by Id
//! @route    GET /api/product/:productId
//! @access   Public
router.get('/products/:productId', productController.getProduct);

//! @desc     Fetch one Product by slug
//! @route    GET /api/products/slug/:slug
//! @access   Public
router.get('/products/slug/:slug', productController.getProductBySlug);
//! @desc     Create a new Product
//! @route    POST /api/products
//! @access   Private: Admin

router.post(
  '/products',
  authenticate,
  isAdmin,
  uploadHandler,
  validateSchema(createProductSchema),
  productController.createProduct
);

//! @desc     Delete multiple Product(s)
//! @route    DEL /api/products
//! @access   Private: Admin
router.delete(
  '/products',
  authenticate,
  isAdmin,
  productController.removeProducts
);

//! @desc     Delete one Product
//! @route    DEL /api/product/:productId
//! @access   Private: Admin
router.delete(
  '/products/:productId',
  authenticate,
  isAdmin,
  productController.removeProduct
);

//! @desc     Update one Product
//! @route    PUT /api/product/:productId
//! @access   Private
router.put(
  '/products/:productId',
  authenticate,
  isAdmin,
  uploadHandler,
  validateSchema(updateProductSchema),
  productController.updateProduct
);

//! @desc     Search the product
//! @route    POST /api/search/filters
//! @access   Public
router.post('/search/filters', productController.getProductsByFilters);

export default router;
