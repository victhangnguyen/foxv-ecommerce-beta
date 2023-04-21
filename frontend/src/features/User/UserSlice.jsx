import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

//! imp Services
import userService from './services/userService';

export const getUsersByFilters = createAsyncThunk(
  '/user/getUsersByFilters',
  async ({ sort, order, page, perPage, search }, thunkAPI) => {
    try {
      const response = await userService.getUsersByFilters({
        sort,
        order,
        page,
        perPage,
        ...search,
      });

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
  entities: [],
  entitiesCount: 0,
  loading: false,
  success: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getUsersByFilters.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUsersByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload.users;
        state.entitiesCount = action.payload.usersCount;
      })
      .addCase(getUsersByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {} = userSlice.actions;
const reducer = userSlice.reducer;

export default reducer;
