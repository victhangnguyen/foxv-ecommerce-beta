import axiosInstance from './axiosInstance';
import * as urlHandling from '../utils/url';

export function getCart() {
  const url = `/carts/`;
  return axiosInstance.get(url);
}

export const postCart = (cart) => {
  const { cartItems } = cart;
  const url = `/carts/`;
  return axiosInstance.post(url, { cartItems });
};
