import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

//! imp APIs
import API from '../../API';

const initialState = {
  categories: [],
  category: null,
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState: initialState,
  reducers: {
    emptyCategory: (state, action) => {
      state.category = initialState.category;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state, action) => {
        state.loading = true;
        state.error = initialState.error;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload?.data.categories;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
    builder
      .addCase(getCategoryById.pending, (state, action) => {
        state.loading = true;
        state.error = initialState.error;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload.data.category;
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
    builder
      .addCase(updateCategoryById.pending, (state, action) => {
        state.loading = true;
        state.error = initialState.error;
      })
      .addCase(updateCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload.data.updatedCategory;
      })
      .addCase(updateCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

//! Async Thunk Function

export const { emptyCategory } = categorySlice.actions;
const reducer = categorySlice.reducer;

export default reducer;

export const getCategories = createAsyncThunk(
  'category/getCategories',
  async (_, thunkAPI) => {
    try {
      const response = await API.category.getCategories();

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

export const getCategoryById = createAsyncThunk(
  'category/getCategoryById',
  async (categoryId, thunkAPI) => {
    try {
      const response = await API.category.getCategoryById(categoryId);
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

export const updateCategoryById = createAsyncThunk(
  'category/updateCategoryById',
  async ({ categoryId, categoryData }, thunkAPI) => {
    try {
      const response = await API.category.updateCategoryById(
        categoryId,
        categoryData
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
