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
  removeProduct: (productId) => {
    const url = `/product/${productId}`;
    return axiosInstance.delete(url);
  },
};

export default productService;
