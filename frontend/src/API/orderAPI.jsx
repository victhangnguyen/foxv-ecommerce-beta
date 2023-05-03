import axiosInstance from './axiosInstance';
import * as urlHandling from '../utils/url';

/**
 * checkoutOrder
 */
export function checkoutOrder({
  name,
  address,
  items,
  orderPayAmount,
  bankCode,
}) {
  const url = `/orders/checkout`;
  return axiosInstance.post(url, {
    name,
    address,
    items,
    orderPayAmount,
    bankCode,
  });
}

/**
 * createOrder
 */
export function createOrder({
  user,
  items,
  total,
  status,
  name,
  address,
  transactionNo,
  bankTranNo,
}) {
  const orderData = {
    user,
    items,
    total,
    status,
    name,
    address,
    transactionNo,
    bankTranNo,
  };
  const url = `/admin/orders/create`;
  return axiosInstance.post(url, orderData);
}

/**
 * getOrderById
 */
export function getOrderById(orderId) {
  const url = `/orders/${orderId}`;
  return axiosInstance.get(url);
}

export function getOrdersByFilters({ sort, order, page, perPage, search }) {
  const url = `/orders/search/filters`;
  const urlQueryParams = urlHandling.serializeQueryParams(url, {
    sort,
    order,
    page,
    perPage,
    ...search,
  });
  return axiosInstance.get(urlQueryParams);
}

//! Private: Admin
export function deleteOrder(orderId) {
  const url = `/admin/orders/delete-single?orderId=${orderId}`;
  return axiosInstance.delete(url);
}

//! Private: Admin
export function deleteOrders(orderIds) {
  const url = `/admin/orders/delete-multiple`;
  const urlQueryParams = urlHandling.serializeQueryArray(
    url,
    orderIds,
    'orderIds'
  );
  return axiosInstance.delete(urlQueryParams);
}

//! Private: Admin
export function updateOrderById(
  orderId,
  { address, bankTranNo, name, status, transactionNo }
) {
  const url = `/admin/orders/${orderId}/update`;
  return axiosInstance.put(url, {
    address,
    bankTranNo,
    name,
    status,
    transactionNo,
  });
}
