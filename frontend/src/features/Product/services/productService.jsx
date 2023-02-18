import axiosInstance from '../../../services/axiosInstance';

const productService = {
  getProductsCount: () => {
    const url = `/products/total`;
    return axiosInstance.get(url);
  },
  getProduct: (productId) => {
    const url = `/product/${productId}`;
    return axiosInstance.get(url, productId);
  },
  getProductList: (sort, order, page, perPage) => {
    const url = `/products`;
    return axiosInstance.post(url, { sort, order, page, perPage });
  },
  createProduct: (product) => {
    const url = `/product`;
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return axiosInstance.post(url, product, config);
  },
  updateProduct: (productId, product) => {
    const url = `/product/${productId}`;
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return axiosInstance.put(url, product, config);
  },
  removeProduct: (productId) => {
    const url = `/product/${productId}`;
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
  fetchProductsByFilter: (search, sort, order, page, perPage) => {
    const url = `/search/filters`;
    return axiosInstance.post(url, { search, sort, order, page, perPage });
  },
};

export default productService;
