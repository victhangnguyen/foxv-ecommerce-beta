import express from 'express';
//! Ctrls
import * as paymentController from '../controllers/payment.js';
import { authenticate, isUser } from '../middleware/passport/index.js';

const router = express.Router();

//! @desc     Get Vnpay Return
//! @route    GET /api/payment/vnpay/vnpay-return
//! @access   Vnpay access Server
router.get('/payment/vnpay/vnpay-return', paymentController.getVnpayReturn); //! không sử dụng authenticate về đây là của bank

//! @desc     Get Vnpay Ipn
//! @route    GET /api/payment/vnpay/vnpay-ipn
//! @access   Vnpay access Server
router.get('/payment/vnpay/vnpay-ipn', paymentController.getVnpayIpn);

export default router;
