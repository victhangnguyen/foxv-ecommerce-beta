import axiosInstance from '../../../services/axiosInstance';

const productService = {
  //! @desc     Fetch one product
  //! @route    GET /api/products/:productId
  //! @access   Public
  getProduct: (productId) => {
    const url = `/product/${productId}`;
    return axiosInstance.get(url, productId)
  },
};

export default productService;
