import User from '../models/User.js';
import Order from '../models/Order.js';
import paymentService from './paymentService.js';
import { execWithTransaction } from '../utils/transaction.js';
import mongoose from 'mongoose';

async function createOrUpdateOrderByUserId(userId, orderData) {
  if (mongoose.Types.ObjectId.isValid(userId)) {
    const userDoc = await User.findById(userId).exec();

    if (!userDoc) {
      throw new Error('User does not exist');
    }

    orderData.user = userDoc._id;
  }

  //! Check item's Quantity
  if (!orderData.items || orderData.items.length === 0) {
    throw new Error('Invalid order items');
  }

  //! Check Payment Methods
  // if (!Object.values(constants.ORDER.PAYMENT_METHOD).includes(orderData.paymentMethod)) {
  //   throw ApiErrorUtils.simple('Invalid payment method', 400);
  // }

  //! create or Update Order with Transaction
  const order = await execWithTransaction(async () => {
    const _order = await Order.createOrUpdateOrderByUserId(userId, {
      ...orderData,
    });
    return _order;
  });

  return order;
}

export default {
  createOrUpdateOrderByUserId,
};
