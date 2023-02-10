import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

//! imp Services
import productService from './services/productService';

export const getProductList = createAsyncThunk(
  'product/getProductList',
  async (args, thunkAPI) => {
    //! arg -> { object }
    try {
      const response = await productService.getProductList(
        args.sort,
        args.order,
        args.page,
        args.perPage
      );
      //! response -> products

      return thunkAPI.fulfillWithValue(response);
    } catch (error) {
      if (error.response && error.response.data.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      } else {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  }
);

export const getProductsCount = createAsyncThunk(
  'product/getProductsCount',
  async (_, thunkAPI) => {
    try {
      let response = await productService.getProductsCount();
      //! response -> productsCount
      if (response.data === 0) {
        response = 0;
      }

      return thunkAPI.fulfillWithValue(response);
    } catch (error) {
      if (error.response && error.response.data.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      } else {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  }
);

export const removeProduct = createAsyncThunk(
  'product/removeProduct',
  async (productId, thunkAPI) => {
    try {
      const response = await productService.removeProduct(productId);
      //! response -> products with skip/limit/sort

      return thunkAPI.fulfillWithValue(response);
    } catch (error) {
      if (error.response && error.response.data.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      } else {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  }
);

const initialState = {
  products: [],
  productsCount: 0,
  loading: false,
  error: false,
};

const productSlice = createSlice({
  name: 'product',
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getProductList.pending, (state, action) => {
        state.loading = true;
        // state.products = initialState.products;
      })
      .addCase(getProductList.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getProductsCount.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getProductsCount.fulfilled, (state, action) => {
        state.loading = false;
        state.productsCount = action.payload;
      })
      .addCase(getProductsCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(removeProduct.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(product => product._id !== action.payload._id);
        state.productsCount -= 1;
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {} = productSlice.actions;
const reducer = productSlice.reducer;

export default reducer;
