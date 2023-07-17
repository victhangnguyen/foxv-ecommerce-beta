import express from "express";
//! imp Controllers
import * as orderController from "../controllers/order.js";
//! imp Middlewares
import { authenticate, isUser, isAdmin } from "../middleware/passport/index.js";
import { validateSchema } from "../middleware/validator.js";
import { updateOrderSchema } from "../middleware/schemaValidations/index.js";

const router = express.Router();

//! @desc     Fetch one Order
//! @route    GET /api/orders/:orderId
//! @access   Private: User
router.get("/orders/:orderId", authenticate, orderController.getOrderById);

//! @desc     Fetch all orders by Filters
//! @route    GET /api/orders/search/filters
//! @access   Public
router.get("/orders/search/filters", orderController.getOrdersByFilters);

//! @desc     Create a new Order
//! @route    POST /orders/checkout
//! @access   Private: User
router.post(
  "/orders/checkout",
  authenticate,
  orderController.createOrderByUserId
);

//! @desc     Create a new Order
//! @route    POST /admin/orders/create
//! @access   Private: Admin
router.post(
  "/admin/orders/create",
  authenticate,
  isAdmin,
  orderController.createOrder
);

//! @desc     Delete One Order
//! @route    DEL /api/admin/orders/delete-single'
//! @access   Private: Admin
router.delete(
  "/admin/orders/delete-single",
  authenticate,
  isAdmin,
  orderController.deleteOrder
);

//! @desc     Delete One Order By UserId
//! @route    DEL /api/orders/delete-single'
//! @access   Private: User
router.delete(
  "/orders/delete-single",
  authenticate,
  orderController.deleteOrder
);

//! @desc     Delete Many Orders
//! @route    DEL /api/admin/orders/delete-multiple'
//! @access   Private: Admin
router.delete(
  "/admin/orders/delete-multiple",
  authenticate,
  isAdmin,
  orderController.deleteOrdersByIds
);

//! @desc     Delete Many Orders By UserId
//! @route    DEL /api/orders/delete-multiple'
//! @access   Private: User
router.delete(
  "/orders/delete-multiple",
  authenticate,
  orderController.deleteOrdersByIds
);

//! @desc     Update One Order
//! @route    PUT /api/orders/:orderId/update
//! @access   Private: Admin
router.put(
  "/admin/orders/:orderId/update",
  authenticate,
  isAdmin,
  validateSchema(updateOrderSchema),
  orderController.updateOrder
);

//! @desc     Fetch one Invoice
//! @route    GET /api/products
//! @access   Public
router.get("/orders/:orderId/invoice", authenticate, orderController.getInvoice);

export default router;
