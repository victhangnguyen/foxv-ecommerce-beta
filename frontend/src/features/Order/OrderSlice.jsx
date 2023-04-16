import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
//! imp Services
import API from '../../API';

export const getOrderById = createAsyncThunk(
  'order/getOrderById',
  async (orderId, thunkAPI) => {
    try {
      const response = await API.getOrderById(orderId);
      return thunkAPI.fulfillWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.message,
        response: {
          data: error.response.data,
          status: error.response.status,
          statusText: error.response.statusText,
        },
      });
    }
  }
);

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async ({ name, address, items, orderPayAmount, bankCode }, thunkAPI) => {
    try {
      const response = await API.checkoutOrder({
        name,
        address,
        items,
        orderPayAmount,
        bankCode,
      });

      return thunkAPI.fulfillWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.message,
        response: {
          data: error.response.data,
          status: error.response.status,
          statusText: error.response.statusText,
        },
      });
    }
  }
);

export const getOrdersByFilters = createAsyncThunk(
  'order/getOrdersByFilters',
  async ({ sort, order, page, perPage, search }, thunkAPI) => {
    try {
      const response = await API.getOrdersByFilters({
        sort,
        order,
        page,
        perPage,
        search,
      });
      return thunkAPI.fulfillWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.message,
        response: {
          data: error.response.data,
          status: error.response.status,
          statusText: error.response.statusText,
        },
      });
    }
  }
);

const initialState = {
  orders: [],
  ordersCount: 0,
  order: null, //! detail
  newOrder: null, //! created
  loading: false,
  error: null,
};

const OrderSlice = createSlice({
  name: 'order',
  initialState: initialState,
  reducers: {
    emptyNewOrder: (state) => {
      state.newOrder = initialState.newOrder;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.newOrder = {
          ...action.payload.data.order,
          paymentUrl: action.payload.data.paymentUrl,
        };
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
    builder
      .addCase(getOrdersByFilters.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getOrdersByFilters.fulfilled, (state, action) => {
        console.log(
          '__Debugger__OrderSlice\n__getOrderByFilters__action.payload: ',
          action.payload,
          '\n'
        );
        state.loading = false;
        state.orders = action.payload.orders;
        state.ordersCount = action.payload.ordersCount;
      })
      .addCase(getOrdersByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
    builder
      .addCase(getOrderById.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.data.order;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { emptyNewOrder } = OrderSlice.actions;
const reducer = OrderSlice.reducer;

export default reducer;
