import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

//! imp APIs
import API from '../../API';

const initialState = {
  products: [],
  productsCount: 0,
  product: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState: initialState,
  reducers: {
    emptyProduct: (state, action) => {
      state.product = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductById.pending, (state, action) => {
        state.loading = true;
        state.error = initialState.error;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.data.product;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
    builder
      .addCase(getProductsByFilters.pending, (state, action) => {
        state.loading = true;
        state.error = initialState.error;
      })
      .addCase(getProductsByFilters.fulfilled, (state, action) => {
        //! action.payload = {products, productsCount}
        state.loading = false;
        state.products = action.payload.data.products;
        state.productsCount = action.payload.data.productsCount;
      })
      .addCase(getProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
    builder
      .addCase(updateProductById.pending, (state, action) => {
        state.loading = true;
        state.error = initialState.error;
      })
      .addCase(updateProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.data.product;
      })
      .addCase(updateProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
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
  },
});

export const { emptyProduct } = productSlice.actions;
const reducer = productSlice.reducer;

export default reducer;

//! Async Thunk
export const getProductById = createAsyncThunk(
  'product/getProductById',
  async (productId, thunkAPI) => {
    try {
      const response = await API.product.getProductById(productId);
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

export const getProductsByFilters = createAsyncThunk(
  'product/getProductsByFilters',
  async ({ sort, order, page, perPage, filterOpts }, thunkAPI) => {
    try {
      const response = await API.product.getProductsByFilters(
        sort,
        order,
        page,
        perPage,
        filterOpts
      );
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

export const updateProductById = createAsyncThunk(
  'product/updateProductById',
  async ({ productId, productData }, thunkAPI) => {
    try {
      const response = await API.product.updateProductById(
        productId,
        productData
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

export const removeProduct = createAsyncThunk(
  'product/removeProduct',
  async (productId, thunkAPI) => {
    try {
      const response = await API.product.removeProduct(productId);
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
  async (productIds, thunkAPI) => {
    try {
      const response = await API.product.removeProducts(productIds);
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
