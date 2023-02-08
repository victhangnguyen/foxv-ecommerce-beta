import express from 'express';
import * as productController from '../controllers/product.js';

const router = express.Router();

router.get('/product/:productId', productController.getProduct);

export default router;
