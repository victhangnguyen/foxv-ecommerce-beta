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
import e from "express";

async function createOrder(orderData, session) {
  try {
    await productService.checkReserveProducts(orderData.items, session);

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
          },
        },
        { session }
      );
    });

    //! execute Promise Quene
    await Promise.all(updatedStockQuene);

    return createdOrder;
  } catch (error) {
    throw error;
  }
}

async function checkoutOrder(userId, orderData, session) {
  /*
  orderData:
    orderId: req.body.orderId,
    name: req.body.name,
    address: req.body.address,
    items: req.body.items,
    bankCode: req.body.bankCode,
    total: req.body.orderPayAmount,
  */
  const { orderId, ...otherData } = orderData;

  try {
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      status: "pending",
    }).sort({ createdAt: -1 });

    //! if order is updated items =>  re-reserved Products
    if (order) {
      // if (orderData.status === constants.order.STATUS.CANCELED) {
      const updatedStockQuene = order.items.map(async (item) => {
        const product = await Product.findById(item.product);

        return await product.updateOne(
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
          { session: session }
        );
      });

      const result = await Promise.all(updatedStockQuene);
      console.log(
        "__Debugger__orderService\n:::checkoutOrder :::result: ",
        result,
        "\n"
      );
      // }
    }

    await productService.checkReserveProducts(orderData.items, session);

    let currentOrder;

    if (order) {
      console.log('checkoutOrder - UPDATE')
      //! updateOrder: items and total
      currentOrder = await Order.findByIdAndUpdate(
        order._id,
        { items: orderData.items, total: orderData.total },
        { session, new: true }
      );
      // return order;
    } else {
      //! createOrder
      currentOrder = await Order.create({ ...otherData, user: userId });
      console.log('checkoutOrder - CREATE NEW')

    }

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
              orderId: currentOrder._id,
              userId: userId,
              quantity: item.quantity,
              productId: item.product,
            },
          },
        },
        { session }
      );
    });
    //! execute Promise Quene
    await Promise.all(updatedStockQuene);

    return currentOrder;
  } catch (error) {
    throw error;
  }
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

  //! if order is cancelled  re-reserved Products
  //! if transaction is cancelled , return the product to the inventory
  if (orderData.status === constants.order.STATUS.CANCELED) {
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
  }

  const updatedOrder = await order.update(updateData, { session });

  return updatedOrder;
}

/**
 * Create an Invoice
 * @param {string} orderId - The Id of the order
 * @param {object} orderData - The data of the order
 * @returns {string} The url of the Invoice
 */

export default {
  createOrder,
  checkoutOrder,
  deleteOrderById,
  updateOrderById,
};


