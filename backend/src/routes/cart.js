import express from 'express';
import * as cartController from '../controllers/cart.js';
//! imp Auth
import { isUser } from '../middleware/passport/index.js';
//! imp Validations
import { validateSchema } from '../middleware/validator.js';
//! imp Middlewares
import { authenticate } from '../middleware/passport/index.js';

const router = express.Router();

//! @desc     Fetch an Cart
//! @route    GET /api/carts
//! @access   Public
router.get('/carts', authenticate, cartController.getCart);

//! @desc     Save a Cart
//! @route    POST /api/carts
//! @access   Public: User
router.post('/carts', authenticate, cartController.postCart)

export default router;
