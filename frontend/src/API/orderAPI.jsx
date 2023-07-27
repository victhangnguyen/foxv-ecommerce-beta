import axiosInstance from "./axiosInstance";
import * as urlHandling from "../utils/url";
import axios from "axios";

/**
 * checkoutOrder
 */
export function checkoutOrder({
  orderId,
  name,
  address,
  items,
  orderPayAmount,
  bankCode,
}) {
  const url = `/orders/checkout`;
  return axiosInstance.post(url, {
    orderId,
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

/**
 * deleteOrder
 * Private: Admin
 */
export function deleteOrder(orderId) {
  const url = `/admin/orders/delete-single?orderId=${orderId}`;
  return axiosInstance.delete(url);
}

/**
 * deleteOrderByUserId
 * Private: User
 */
export function deleteOrderByUserId(orderId) {
  console.log(
    "__Debugger__orderAPI\n__deleteByUserId__orderId: ",
    orderId,
    "\n"
  );
  const url = `/orders/delete-single?orderId=${orderId}`;
  return axiosInstance.delete(url);
}

//! Private: Admin
export function deleteOrders(orderIds) {
  const url = `/admin/orders/delete-multiple`;
  const urlQueryParams = urlHandling.serializeQueryArray(
    url,
    orderIds,
    "orderIds"
  );
  return axiosInstance.delete(urlQueryParams);
}

/**
 * deleteOrdersByUserId
 * Private: User
 */
export function deleteOrdersByUserId(orderIds) {
  const url = `/orders/delete-multiple`;
  const urlQueryParams = urlHandling.serializeQueryArray(
    url,
    orderIds,
    "orderIds"
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

// Private: Public
export function getInvoice(orderId) {
  const url = `/orders/${orderId}/invoice`;
  return axiosInstance.get(url);
}
