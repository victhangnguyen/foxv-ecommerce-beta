import express from 'express';
//! imp Controllers
import * as orderController from '../controllers/order.js';
//! imp Middlewares
import { authenticate } from '../middleware/passport/index.js';

const router = express.Router();

//! @desc     Fetch one Order
//! @route    GET /api/orders/:orderId
//! @access   Private: User
router.get('/orders/:orderId', authenticate, orderController.getOrderById);

//! @desc     Fetch all orders by Filters
//! @route    GET /api/orders/search/filters
//! @access   Public
router.get('/orders/search/filters', orderController.getOrdersByFilters);

//! @desc     Create a new Order
//! @route    POST /orders/checkout
//! @access   Private: User
router.post(
  '/orders/checkout',
  authenticate,
  orderController.createOrderByUserId
);

export default router;
