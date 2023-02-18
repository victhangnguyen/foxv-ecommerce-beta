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
  upload.array('images[]'),
  productController.createProduct
);

//! @desc     Fetch Count of All Products
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

//! @desc     Delete multiple Product(s)
//! @route    DEL /api/products
//! @access   Private: Admin
router.delete('/products', productController.removeProducts);

//! @desc     Delete one Product
//! @route    DEL /api/product/:productId
//! @access   Private: Admin
router.delete('/product/:productId', productController.removeProduct);

//! @desc     Update one Product
//! @route    PUT /api/product/:productId
//! @access   Private
router.put(
  '/product/:productId',
  upload.array('images[]'),
  productController.updateProduct
);

//! @desc     Search the product
//! @route    POST /api/search/filters
//! @access   Public
router.post('/search/filters', productController.fetchProductsByFilter)


export default router;
