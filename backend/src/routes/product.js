import express from 'express';
import * as productController from '../controllers/product.js';
//! imp Middleware
import upload from '../middleware/upload.js';

const router = express.Router();

//! @desc     Create a new Product
//! @route    POST /api/products
//! @access   Private: Admin
router.post(
  '/product',
  upload.array('images[]', 10),
  productController.createProduct
);

//! @desc     Fetch Count of all product
//! @route    GET /api/products/total
//! @access   Public
router.get('/products/total', productController.productsCount);

//! @desc     Fetch all products with Pagination
//! @route    POST /api/products
//! @access   Public
router.post('/products', productController.getProductList);

//! @desc     Fetch one Product by Id
//! @route    GET /api/product/:productId
//! @access   Public
router.get('/product/:productId', productController.getProduct);

//! @desc     Delete one Product
//! @route    DEL /api/product/:productId
//! @access   Private:Admin
router.delete('/product/:productId', productController.removeProduct);

export default router;
