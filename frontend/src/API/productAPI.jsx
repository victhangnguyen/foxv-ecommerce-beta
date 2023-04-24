import axiosInstance from './axiosInstance';
import * as urlHandling from '../utils/url';

export function getProductById(productId) {
  const url = `/products/${productId}`;
  return axiosInstance.get(url);
}

export function getProductBySlug(slug) {
  const url = `/products/slug/${slug}`;
  return axiosInstance.get(url);
}

export function getProductList(params) {
  const url = `/products`;
  const urlQueryParams = urlHandling.serializeQueryParams(url, params);
  return axiosInstance.get(urlQueryParams);
}

export function createProduct(product) {
  const url = `/products`;
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  return axiosInstance.post(url, product, config);
}

export function updateProduct(productId, product) {
  const url = `/products/${productId}`;
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  return axiosInstance.put(url, product, config);
}

export function removeProduct(productId) {
  const url = `/products/${productId}`;
  return axiosInstance.delete(url);
}

export function removeProducts(productIds) {
  const idPairs = urlHandling.serializeQueryArray(productIds);
  const url = `/products?${idPairs}`;
  return axiosInstance.delete(url);
}

export function getProductsByFilters(search, sort, order, page, perPage) {
  const url = `/search/filters`;
  return axiosInstance.post(url, { search, sort, order, page, perPage });
}
