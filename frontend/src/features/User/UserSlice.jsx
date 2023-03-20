import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

//! imp Services
import userService from './services/userService';

export const fetchUsersByFilters = createAsyncThunk(
  '/user/fetchUsersByFilters',
  async (arg, thunkAPI) => {
    const { search, sort, order, page, perPage } = arg;
    try {
      const response = await userService.fetchUsersByFilters({
        ...search,
        sort,
        order,
        page,
        perPage,
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

export const deleteUsers = createAsyncThunk(
  'user/deleteUsers',
  async (userIds, thunkAPI) => {
    try {
      const response = await userService.deleteUsers(userIds);

      return thunkAPI.fulfillWithValue(response);
    } catch (error) {
      console.log('__Debugger__UserSlice\n__removeUser__error: ', error, '\n');
      return thunkAPI.rejectWithValue({
        status: error.response?.status,
        success: error.response?.data.success,
        error: error.response?.data.message || error.message,
      });
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
      .addCase(fetchUsersByFilters.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchUsersByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload.users;
        state.entitiesCount = action.payload.usersCount;
      })
      .addCase(fetchUsersByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(deleteUsers.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteUsers.fulfilled, (state, action) => {
        state.loading = false;
        // state.entities = minus one entity and update one behind the entity
        state.entitiesCount -= 1;
        state.success = action.payload?.success;
      })
      .addCase(deleteUsers.rejected, (state, action) => {
        state.loading = false;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      });
  },
});

export const {} = userSlice.actions;
const reducer = userSlice.reducer;

export default reducer;
