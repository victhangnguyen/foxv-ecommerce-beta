//! imp Config
import config from "../config/index.js";
//! imp Constants
import constants from "../constants/index.js";
//! imp Models
import Order from "../models/Order.js";
import Product from "../models/Product.js";
//! imp Utils
import { execWithTransaction } from "../utils/transaction.js";
// imp Services
import productService from "../services/productService.js";

async function createOrder(orderData, session) {
  try {
    // const stock = await Product.find({
    //   _id: { $in: items.map((item) => item.product) },
    //   quantity: { $lt: item.quantity },
    // });

    productService.reserveProducts(orderData.items, session);
    //! localFunction

    //createOrder
    const createdOrder = await Order.create(orderData);

    const updatedStockQuene = orderData.items.map(async (item) => {
      const product = await Product.findById(item.product);

      return product.updateOne(
        {
          $inc: {
            //! (in-de)crease
            quantity: -Number(item.quantity),
          },
          $push: {
            //! giảm kho và thêm vào dữ liệu reservations
            reservations: {
              orderId: createdOrder._id,
              userId: createdOrder.user,
              quantity: item.quantity,
              productId: item.product,
            },
            isEnoughStock: product.isEnoughStock(+item.quantity),
          },
        },
        { session: session }
      );
    });

    //! execute Promise Quene
    await Promise.all(updatedStockQuene);

    return createdOrder;
  } catch (error) {
    throw error;
  }
}

async function createOrUpdateOrderByUserId(userId, orderData) {
  //! Check item's Quantity
  if (!orderData.items || orderData.items.length === 0) {
    throw new Error("Invalid order items");
  }

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
    throw Error("Order does not exist!"); //! Forbidden
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
    throw Error("Order does not exist!"); //! Forbidden
  }
  let updateData = { ...orderData };

  // disable change status when order is canceled
  if (order.status === constants.order.STATUS.CANCELED) {
    updateData = { ...orderData, status: constants.order.STATUS.CANCELED };
  }

  const updatedOrder = await order.update(updateData, { session });

  //! if transaction is cancelled , return the product to the inventory
  const updatedStockQuene = order.items.map(async (item) => {
    const product = await Product.findById(item.product);

    return product.updateOne(
      {
        $inc: {
          //! (in-de)crease
          quantity: +Number(item.quantity),
        },
        $pull: {
          //! giảm kho và thêm vào dữ liệu reservations
          reservations: {
            orderId: order._id,
          },
        },
      },
      { session: session, lean: true }
    );
  });

  await Promise.all(updatedStockQuene);

  return order;
}

/**
 * Create an Invoice
 * @param {string} orderId - The Id of the order
 * @param {object} orderData - The data of the order
 * @returns {string} The url of the Invoice
 */

export default {
  createOrder,
  createOrUpdateOrderByUserId,
  deleteOrderById,
  updateOrderById,
};
