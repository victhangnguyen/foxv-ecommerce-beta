import Order from '../models/Order.js';
import paymentService from './paymentService.js';
import { execWithTransaction } from '../utils/transaction.js';
import mongoose from 'mongoose';

async function createOrUpdateOrderByUserId(userId, orderData) {
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

/**
 * Delete an Order
 * @param {string} orderId - The Id of the order
 * @param {object} session - The session that is used to execute Transaction
 * @returns {object} The object of the order that is deleted
 */
async function deleteOrderById(orderId, session) {
  const order = await Order.findById(orderId).exec();

  if (!order) {
    throw Error('Order does not exist!'); //! Forbidden
  }

  const deletedOrder = await order.remove({ session });

  return deletedOrder;
}

/**
 * Update an Order
 * @param {string} orderId - The Id of the order
 * @param {object} orderData - The data of the order
 * @param {object} session - The session that is used to execute Transaction
 * @returns {object} The object of the order that is updated
 */
async function updateOrderById(orderId, orderData, session) {
  const order = await Order.findById(orderId).exec();

  if (!order) {
    throw Error('Order does not exist!'); //! Forbidden
  }

  const updatedOrder = await order.update(orderData, { session });

  return updatedOrder;
}

export default {
  createOrUpdateOrderByUserId,
  deleteOrderById,
  updateOrderById,
};
