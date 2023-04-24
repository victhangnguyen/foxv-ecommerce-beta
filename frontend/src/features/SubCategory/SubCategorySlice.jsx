import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
//! imp APIs
import API from '../../API';

const initialState = {
  subCategories: [],
  subCategory: null,
  loading: false,
  error: null,
};

const SubCategorySlice = createSlice({
  name: 'subCategory',
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getSubCategoryById.pending, (state, action) => {
        state.loading = true;
        state.error = initialState.error;
      })
      .addCase(getSubCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategory = action.payload.data.subCategory;
      })
      .addCase(getSubCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
    builder
      .addCase(getSubCategories.pending, (state, action) => {
        state.loading = true;
        state.error = initialState.error;
      })
      .addCase(getSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories = action.payload.data.subCategories;
      })
      .addCase(getSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
    builder
      .addCase(getSubCategoriesByCategoryId.pending, (state, action) => {
        state.loading = true;
        state.error = initialState.error;
      })
      .addCase(getSubCategoriesByCategoryId.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories = action.payload.data.subCategories;
      })
      .addCase(getSubCategoriesByCategoryId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
    builder
      .addCase(updateSubCategoryById.pending, (state, action) => {
        state.loading = true;
        state.error = initialState.error;
      })
      .addCase(updateSubCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategory = action.payload.data.updatedSubCategory;
      })
      .addCase(updateSubCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const {} = SubCategorySlice.actions;
const reducer = SubCategorySlice.reducer;

export default reducer;

//! Async Thunk Function
export const getSubCategoryById = createAsyncThunk(
  'subCategory/getSubCategoryById',
  async (subCategoryId, thunkAPI) => {
    try {
      const response = await API.subCategory.getSubCategoryById(subCategoryId);
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

export const getSubCategories = createAsyncThunk(
  'subCategory',
  async (_, thunkAPI) => {
    try {
      const response = await API.subCategory.getSubCategories();
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

export const getSubCategoriesByCategoryId = createAsyncThunk(
  'subCategory/loadSubCategoriesByCategoryId',
  async (categoryId, thunkAPI) => {
    try {
      const response = await API.subCategory.getSubCategoriesByCategoryId(
        categoryId
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

export const updateSubCategoryById = createAsyncThunk(
  'subCategory/updateSubCategoryById',
  async ({ subCategoryId, subCategoryData }, thunkAPI) => {
    try {
      const response = await API.subCategory.updateSubCategoryById(
        subCategoryId,
        subCategoryData
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
