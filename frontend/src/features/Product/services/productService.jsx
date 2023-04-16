import axiosInstance from '../../../API/axiosInstance';

//! imp Utils
import * as urlHandling from '../../../utils/url';

const productService = {
  getProductsCount: () => {
    const url = `/products/total`;
    return axiosInstance.get(url);
  },
  getProduct: (productId) => {
    const url = `/products/${productId}`;
    return axiosInstance.get(url);
  },
  getProductBySlug: (slug) => {
    const url = `/products/slug/${slug}`;
    return axiosInstance.get(url);
  },
  getProductList: (params) => {
    const url = `/products`;
    const urlQueryParams = urlHandling.queryParam(url, params);
    return axiosInstance.get(urlQueryParams);
  },
  createProduct: (product) => {
    const url = `/products`;
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return axiosInstance.post(url, product, config);
  },
  updateProduct: (productId, product) => {
    const url = `/products/${productId}`;
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return axiosInstance.put(url, product, config);
  },
  removeProduct: (productId) => {
    const url = `/products/${productId}`;
    return axiosInstance.delete(url);
  },
  removeProducts: (productIds) => {
    const idPairs = urlHandling.queryIds(productIds);
    const url = `/products?${idPairs}`;
    return axiosInstance.delete(url);
  },
  getProductsByFilters: (search, sort, order, page, perPage) => {
    const url = `/search/filters`;
    return axiosInstance.post(url, { search, sort, order, page, perPage });
  },
};

export default productService;
