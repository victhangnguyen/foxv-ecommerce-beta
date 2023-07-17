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
  const url = `/admin/products/create`;
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  return axiosInstance.post(url, product, config);
}

export function updateProductById(productId, productData) {
  const url = `/admin/products/${productId}/update`;
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  return axiosInstance.put(url, productData, config);
}

export function deleteProductById(productId) {
  const url = `/admin/products/delete-single?productId=${productId}`;
  return axiosInstance.delete(url);
}

export function deleteProductsByIds(productIds) {
  const url = `/admin/products/delete-multiple`;
  const urlQueryParams = urlHandling.serializeQueryArray(
    url,
    productIds,
    'productIds'
  );
  return axiosInstance.delete(urlQueryParams);
}

export function getProductsByFilters(sort, order, page, perPage, filterOpts) {
  const url = `/products/search/filters`;
  const urlQueryParams = urlHandling.serializeQueryParams(url, {
    sort,
    order,
    page,
    perPage,
    ...filterOpts,
  });
  return axiosInstance.get(urlQueryParams);
}
