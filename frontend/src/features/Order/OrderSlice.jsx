import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
//! imp Services
import API from '../../API';

const initialState = {
  orders: [],
  ordersCount: 0,
  order: null, //! detail
  newOrder: null, //! created
  loading: false,
  success: null,
  message: null,
  error: null,
};

const OrderSlice = createSlice({
  name: 'order',
  initialState: initialState,
  reducers: {
    emptyNewOrder: (state) => {
      state.newOrder = initialState.newOrder;
    },
    clearNotification: (state) => {
      state.success = initialState.success;
      state.error = initialState.error;
      state.message = initialState.message;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkoutOrder.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(checkoutOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.newOrder = {
          ...action.payload.data.order,
          paymentUrl: action.payload.data.paymentUrl,
        };
      })
      .addCase(checkoutOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
    builder
      .addCase(createOrder.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.data.order;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.error = action.payload.message;
      });
    builder
      .addCase(getOrdersByFilters.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getOrdersByFilters.fulfilled, (state, action) => {
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
    builder
      .addCase(deleteOrder.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.ordersCount -= 1;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
    builder
      .addCase(deleteOrders.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.ordersCount -= action.payload.data.deletedOrdersCount;
      })
      .addCase(deleteOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
    builder
      .addCase(updateOrder.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.error = action.payload.message;
      });
  },
});

export const { emptyNewOrder, clearNotification } = OrderSlice.actions;
const reducer = OrderSlice.reducer;

export default reducer;

//! async Thunk
export const getOrderById = createAsyncThunk(
  'order/getOrderById',
  async (orderId, thunkAPI) => {
    try {
      const response = await API.order.getOrderById(orderId);
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

export const checkoutOrder = createAsyncThunk(
  'order/checkoutOrder',
  async ({ name, address, items, orderPayAmount, bankCode }, thunkAPI) => {
    try {
      const response = await API.order.checkoutOrder({
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

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (
    { user, items, total, status, name, address, transactionNo, bankTranNo },
    thunkAPI
  ) => {
    try {
      const response = await API.order.createOrder({
        user,
        items,
        total,
        status,
        name,
        address,
        transactionNo,
        bankTranNo,
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
      const response = await API.order.getOrdersByFilters({
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

export const deleteOrder = createAsyncThunk(
  'order/deleteOrder',
  async (orderId, thunkAPI) => {
    try {
      const response = await API.order.deleteOrder(orderId);
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

export const deleteOrders = createAsyncThunk(
  'order/deleteOrders',
  async (orderIds, thunkAPI) => {
    try {
      const response = await API.order.deleteOrders(orderIds);
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

export const updateOrder = createAsyncThunk(
  'order/updateOrderById',
  async ({ orderId, orderData }, thunkAPI) => {
    const { address, bankTranNo, name, status, transactionNo } = orderData;
    try {
      const response = await API.order.updateOrderById(orderId, {
        address,
        bankTranNo,
        name,
        status,
        transactionNo,
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
