import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
//! imp Services
import authService from './services/authService';

export const signup = createAsyncThunk(
  'auth/signup',
  async (data, thunkAPI) => {
    try {
      const {
        firstName,
        lastName,
        username,
        email,
        phoneNumber,
        password,
        confirmPassword,
      } = data;
      const response = await authService.signup({
        firstName,
        lastName,
        username,
        email,
        phoneNumber,
        password,
        confirmPassword,
      });
      return response;
    } catch (error) {
      if (error.response?.status === 422) {
        const response = {
          status: 422,
          errors: error.response.data.errors,
        };
        return thunkAPI.rejectWithValue({ response });
      }
    }
  }
);

export const signin = createAsyncThunk(
  'auth/signin',
  async (data, thunkAPI) => {
    const { username, password } = data;
    try {
      const response = await authService.signin({
        username,
        password,
      });

      return thunkAPI.fulfillWithValue(response);
    } catch (error) {
      let response;
      if (error.response?.status === 422) {
        response = {
          status: 422,
          errors: error.response.data.errors,
        };
        return thunkAPI.rejectWithValue({ response });
      }
      response = {
        status: error.response.status,
        error: error.message,
        success: error.response?.data.success,
        message: error.response?.data.message,
      };
      return thunkAPI.rejectWithValue(response);
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refresh-token',
  async (data, thunkAPI) => {
    try {
      const { refreshToken } = data;

      const response = await authService.refreshToken({
        refreshToken,
      });

      return thunkAPI.fulfillWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  loading: false,
  user: null,
  token: null, //! access Token
  refreshToken: null,
  error: null,
  success: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    signout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
      })
      .addCase(signup.rejected, (state, action) => {
        if (action.payload?.response?.status === 422) return;
        state.loading = false;
        state.error = action.payload;
        state.success = action.payload.success;
      });
    builder
      .addCase(signin.pending, (state, action) => {
        state.loading = true;
        state.success = initialState.success;
        state.error = initialState.error;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.refreshToken = action.payload.data.refreshToken;
      })
      .addCase(signin.rejected, (state, action) => {
        if (action.payload?.response?.status === 422) return;
        state.loading = false;
        state.success = action.payload.success;
        state.error = action.payload.error;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      });
    builder
      .addCase(refreshToken.pending, (state, action) => {
        state.loading = true;
        // state.success = initialState.success;
        // state.error = initialState.error;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.token = action.payload.data.token;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { signout } = authSlice.actions;
const reducer = authSlice.reducer;

export default reducer;
