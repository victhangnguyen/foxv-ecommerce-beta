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
 * getOrderById
 */
export function getOrderById(orderId) {
  const url = `/orders/${orderId}`;
  return axiosInstance.get(url);
}

export function getOrdersByFilters({ sort, order, page, perPage, search }) {
  const url = `/orders/search/filters`;
  const urlQueryParams = urlHandling.queryParam(url, {
    sort,
    order,
    page,
    perPage,
    ...search,
  });
  return axiosInstance.get(urlQueryParams);
}
