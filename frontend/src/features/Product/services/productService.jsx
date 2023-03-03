import axiosInstance from '../../../services/axiosInstance';

//! imp Utils
import * as urlHandling from '../../../utils/url';

const productService = {
  getProductsCount: () => {
    const url = `/products/total`;
    return axiosInstance.get(url);
  },
  getProduct: (productId) => {
    const url = `/products/${productId}`;
    return axiosInstance.get(url, productId);
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
  removeProducts: (productIdArray) => {
    const query = 'ids[]=';

    const productIdPairs = productIdArray
      .map((productId) => query + encodeURIComponent(productId))
      .join('&');

    const url = `/products?${productIdPairs}`;
    return axiosInstance.delete(url);
  },
  fetchProductsByFilters: (search, sort, order, page, perPage) => {
    const url = `/search/filters`;
    return axiosInstance.post(url, { search, sort, order, page, perPage });
  },
};

export default productService;
