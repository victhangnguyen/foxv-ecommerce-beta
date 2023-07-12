import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//! imp APIs
import API from "../../API";

const initialState = {
  users: [],
  usersCount: 0,
  user: {},
  newUser: null,
  loading: false,
  success: null,
  message: null,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    emptyUser: (state) => {
      state.user = initialState.user;
    },
    clearNotification: (state) => {
      state.success = initialState.success;
      state.error = initialState.error;
      state.message = initialState.message;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsersByFilters.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUsersByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.users = action.payload.data.users;
        state.usersCount = action.payload.data.usersCount;
      })
      .addCase(getUsersByFilters.rejected, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.error = action.payload.message;
      });
    builder
      .addCase(getUserById.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.error = action.payload.message;
      });
    builder
      .addCase(createUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.newUser = action.payload.data.user;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.error = action.payload.message;
      });
    builder
      .addCase(updateUserInfoById.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateUserInfoById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.updatedUser;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(updateUserInfoById.rejected, (state, action) => {
        
        state.loading = false;
        state.success = action.payload.success;
        state.error = action.payload.message;
      });
    builder
      .addCase(updatePasswordByAdmin.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updatePasswordByAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(updatePasswordByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.error = action.payload.message;
      });
    builder
      .addCase(updatePasswordByUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updatePasswordByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(updatePasswordByUser.rejected, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.error = action.payload.message;
      });
  },
});

export const { emptyUser, clearNotification } = userSlice.actions;
const reducer = userSlice.reducer;

export default reducer;

//! Async Thunk
export const getUserById = createAsyncThunk(
  "/user/getUserById",
  async (userId, thunkAPI) => {
    try {
      const response = await API.user.getUserById(userId);
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

export const getUsersByFilters = createAsyncThunk(
  "/user/getUsersByFilters",
  async ({ sort, order, page, perPage, search }, thunkAPI) => {
    try {
      const response = await API.user.getUsersByFilters({
        sort,
        order,
        page,
        perPage,
        ...search,
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

export const createUser = createAsyncThunk(
  "/user/createUser",
  async (
    { firstName, lastName, username, email, phoneNumber, password },
    thunkAPI
  ) => {
    const userData = { firstName, lastName, username, email, phoneNumber };
    try {
      const response = await API.user.createUser(userData);
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

export const updateUserInfoById = createAsyncThunk(
  "/user/updateUserById",
  async ({ userId, userData }, thunkAPI) => {
    try {
      const response = await API.user.updateUserInfo(userId, userData);
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

export const updatePasswordByAdmin = createAsyncThunk(
  "/user/updatePasswordByAdmin",
  async ({ userId, userData }, thunkAPI) => {
    try {
      const response = await API.user.updatePasswordByAdmin(userId, userData);
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

export const updatePasswordByUser = createAsyncThunk(
  "/user/updatePasswordByUser",
  async ({ userId, userData }, thunkAPI) => {
    try {
      const response = await API.user.updatePasswordByUser(userId, userData);
      console.log(
        "__Debugger__UserSlice\n__updatePasswordByUser__response: ",
        response,
        "\n"
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
