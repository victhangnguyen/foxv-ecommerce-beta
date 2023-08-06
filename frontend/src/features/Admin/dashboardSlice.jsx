//! imp API
import API from "../../API";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  users: [],
  orders: [],
  productsCount: 0,
  usersCount: 0,
  ordersCount: 0,
  loading: false,
  success: null,
  message: null,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAnalysis.pending, (state, action) => {
        state.loading = true;
        state.error = initialState.error;
      })
      .addCase(getAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "fetch Analysis successful";
        state.products = action.payload.products;
        state.users = action.payload.users;
        state.orders = action.payload.orders;
        state.productsCount = action.payload.productsCount;
        state.usersCount = action.payload.usersCount;
        state.ordersCount = action.payload.ordersCount;
      })
      .addCase(getAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export const getAnalysis = createAsyncThunk(
  "dashboard/getAnalysis",
  async (_, thunkAPI) => {
    try {
      const productsResponse = await API.product.getProductsByFilters();

      const usersResponse = await API.user.getUsersByFilters();

      const orderResponse = await API.order.getOrdersByFilters(
        "updatedAt",
        -1,
        _,
        5
      );

      const fulfillResponse = {
        products: productsResponse?.data?.products,
        users: usersResponse?.data?.users,
        orders: orderResponse?.data?.orders,
        productsCount: productsResponse?.data?.productsCount,
        usersCount: usersResponse?.data?.usersCount,
        ordersCount: orderResponse?.data?.ordersCount,
      };

      return thunkAPI.fulfillWithValue(fulfillResponse);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message:
          error.response?.data?.message ||
          error.response?.message ||
          error.message ||
          error,
        response: {
          data: error.response.data,
          status: error.response.status,
          statusText: error.response.statusText,
        },
      });
    }
  }
);

export const {} = dashboardSlice.actions;
const reducer = dashboardSlice.reducer;

export default reducer;
