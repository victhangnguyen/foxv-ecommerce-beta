import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
};
/*
cartItems: [
  {
    _id: string,
    quantity: number,
    title,
    image,
    price
  },
  ...
]
*/
const CartSlice = createSlice({
  name: 'cart',
  initialState: initialState,
  reducers: {
    addToCart: (state, action) => {
      //! action.payload ~ { _id, title, image, price}
      const cartItem = state.cartItems.find(
        (item) => item._id === action.payload._id
      );

      if (cartItem) {
        //! cartItem --refer--> object
        cartItem.quantity++;
      } else {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
    },
    incrementQuantity: (state, action) => {
      const cartItem = state.cartItems.find(
        (item) => item._id === action.payload
      );
      cartItem.quantity++;
    },
    decrementQuantity: (state, action) => {
      const cartItem = state.cartItems.find(
        (item) => item._id === action.payload
      );
      if (cartItem.quantity === 1) {
        cartItem.quantity = 1;
      } else {
        cartItem.quantity--;
      }
    },
    removeItem: (state, action) => {
      const removeItem = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
      state.cartItems = removeItem;
    },
  },
});

export const { addToCart, decrementQuantity, incrementQuantity, removeItem } =
  CartSlice.actions;
const reducer = CartSlice.reducer;

export default reducer;
