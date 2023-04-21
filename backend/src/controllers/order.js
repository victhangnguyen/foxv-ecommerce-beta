import mongoose from 'mongoose';
//! imp Libraries
import Logging from '../library/Logging.js';
//! imp Services
import orderService from '../services/orderService.js';
import paymentService from '../services/paymentService.js';
//! imp Utils
import { execWithTransaction } from '../utils/transaction.js';
//! imp Models
import Order from '../models/Order.js';

export async function getOrderById(req, res, next) {
  const orderId = req.params.orderId;
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist!');
    }

    res.status(200).json({
      success: true,
      message: 'Get Order By Id successful!',
      data: { order },
    });
  } catch (error) {
    Logging.error('Error__ctrls__order: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export async function createOrderByUserId(req, res, next) {
  const userId = req?.user?._id || null;
  // const clientUrl = req.body?.clientUrl || req.headers.origin;

  const { name, address, items, orderPayAmount, bankCode } = req.body;

  const orderData = {
    name,
    address,
    items,
    bankCode,
    total: orderPayAmount,
  };

  try {
    const order = await orderService.createOrUpdateOrderByUserId(
      userId,
      orderData
    );

    console.log(
      '__Debugger__order\n__createOrderByUserid__order: ',
      order,
      '\n'
    );

    if (!order) {
      throw new Error('Create order fail!');
    }

    const apiUrl = `${req.protocol}://${req.get('host')}`;

    const paymentUrl = await paymentService.createPaymentUrl(
      req.ipv4,
      apiUrl,
      req.headers.origin,
      order._id.toString(),
      order.total,
      bankCode // 'NCB'
    );

    res.status(201).json({
      success: true,
      messsage: 'Create an Order successful!',
      data: { order, paymentUrl },
    });
  } catch (error) {
    Logging.error('Error__ctrls__order: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export const getOrdersByFilters = async (req, res, next) => {
  const { sort, order, page, perPage, keyword, status } = req.query;
  console.log(
    '__Debugger__order\n__getOrdersByFilters__status: ',
    status,
    '\n'
  );

  let match = {};
  // if (status) {
  //   match.$and = [{ status }];
  // }
  if (status) {
    match.status = status;
  }

  const skip = (page - 1) * perPage;

  try {
    if (keyword) {
      match.$or = [
        { name: new RegExp(keyword, 'i') },
        { address: new RegExp(keyword, 'i') },
        { status: new RegExp(keyword, 'i') },
      ];
    }

    const result = await Order.aggregate([
      { $match: match },
      { $sort: { [sort]: +order, _id: 1 } },
      {
        $facet: {
          orders: [{ $skip: skip }, { $limit: +perPage }],
          ordersCount: [{ $count: 'count' }],
        },
      },
    ]).exec();

    const orders = result[0].orders;
    const ordersCount = result[0].ordersCount[0]?.count || 0;
    console.log('__Debugger__order\n__count__ordersCount: ', ordersCount, '\n');

    res.status(200).json({ orders, ordersCount });
  } catch (error) {
    Logging.error('Error__ctrls__Order: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};

//! Delete One Order
export async function deleteOrder(req, res, next) {
  const orderId = req.query.orderId;

  try {
    const deletedOrder = await execWithTransaction(async (session) => {
      return await orderService.deleteOrder(orderId, session);
    });

    return res.status(200).json({
      success: true,
      message: 'Delele One Order successful!',
      data: { deletedOrder },
    });
  } catch (error) {
    Logging.error('Error__ctrls__Order: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

//! Delete Multiple Orders
export async function deleteOrders(req, res, next) {
  const orderIds = req.query.orderIds;

  try {
    const deletedOrders = await execWithTransaction(async (session) => {
      const promises = orderIds.map(async (orderId) =>
        orderService.deleteOrderById(orderId, session)
      );

      const results = await Promise.allSettled(promises);

      const hasRejected = results.some(
        (result) => result.status === 'rejected'
      );

      if (hasRejected) {
        throw new Error(
          results
            .find((result) => result.status === 'rejected')
            ?.reason.toString()
            .replace('Error: ', '')
        );
      }

      return results;
    });

    return res.status(200).json({
      success: true,
      message: 'Delele Many Orders successful!',
      data: { deletedOrders, deletedOrdersCount: deletedOrders.length },
    });
  } catch (error) {
    Logging.error('Error__ctrls__Order: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export async function updateOrder(req, res, next) {
  const orderId = req.params.orderId;
  console.log('req.body: ', req.body);
  const orderData = { ...req.body };
  try {
    const updatedOrder = await orderService.updateOrderById(orderId, orderData);
    return res.status(200).json({
      success: true,
      message: 'Update One Order successful!',
      data: { updatedOrder },
    });
  } catch (error) {
    Logging.error('Error__ctrls__Order: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}
