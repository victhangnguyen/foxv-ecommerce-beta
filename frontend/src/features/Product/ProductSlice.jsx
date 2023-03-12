import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

//! imp Services
import productService from './services/productService';

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

export const removeProducts = createAsyncThunk(
  'product/removeProducts',
  async (productIdArray, thunkAPI) => {
    try {
      const response = await productService.removeProducts(productIdArray);
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

export const fetchProductsByFilters = createAsyncThunk(
  'product/fetchProductsByFilters',
  async ({ search, sort, order, page, perPage }, thunkAPI) => {
    try {
      const response = await productService.fetchProductsByFilters(
        search,
        sort,
        order,
        page,
        perPage
      );
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
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState: initialState,
  extraReducers: (builder) => {
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
        state.products = state.products.filter(
          (product) => product._id !== action.payload._id
        );
        state.productsCount -= 1;
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(removeProducts.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(removeProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.product = []; //! performent need Backend return deleted productId to improve UI
        state.productsCount = state.productsCount - action.payload.deletedCount;
      })
      .addCase(removeProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(fetchProductsByFilters.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        //! action.payload = {products, productsCount}
        state.loading = false;
        state.products = action.payload.products;
        state.productsCount = action.payload.productsCount;
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {} = productSlice.actions;
const reducer = productSlice.reducer;

export default reducer;
