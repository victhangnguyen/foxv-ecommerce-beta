import axiosInstance from '../../../API/axiosInstance';

const cartService = {
  getCart: () => {
    const url = `/carts/`;
    return axiosInstance.get(url);
  },
  postCart: (cart) => {
    const { cartItems } = cart;
    const url = `/carts/`;
    return axiosInstance.post(url, { cartItems });
  },
};

export default cartService;
