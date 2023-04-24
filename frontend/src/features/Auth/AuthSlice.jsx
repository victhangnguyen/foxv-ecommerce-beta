import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
//! imp Services
import authService from './services/authService';
//! API
import API from '../../API';

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
      const response = await API.auth.signup({
        firstName,
        lastName,
        username,
        email,
        phoneNumber,
        password,
        confirmPassword,
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

export const signin = createAsyncThunk(
  'auth/signin',
  async (data, thunkAPI) => {
    const { username, password } = data;
    try {
      const response = await API.auth.signin({
        username,
        password,
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

export const refreshToken = createAsyncThunk(
  'auth/refresh-token',
  async (data, thunkAPI) => {
    try {
      const { refreshToken } = data;

      const response = await API.auth.refreshToken(refreshToken);

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
        state.loading = false;
        state.success = action.payload.success;
        if (action.payload?.status === 422) {
          state.error = action.payload.errors[0].msg;
        } else {
          state.error = action.payload.error;
        }
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
        state.user = action.payload.data?.user; //! verify
        state.token = action.payload.data?.token; //! verify
        state.refreshToken = action.payload.data?.refreshToken; //! verify
      })
      .addCase(signin.rejected, (state, action) => {
        console.log('action.payload: ', action.payload);
        if (action.payload.response.status === 422) return;
        state.loading = false;
        state.success = action.payload.response.data.success;
        state.error = action.payload.response.data.message;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      });
    builder
      .addCase(refreshToken.pending, (state, action) => {
        state.loading = true;
        state.error = initialState.error;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        console.log('refreshToken.fulfilled action.payload: ', action.payload);
        state.loading = false;
        state.success = action.payload?.success;
        state.token = action.payload?.data.token;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        console.log('refreshToken.rejected action.payload: ', action.payload);
        state.loading = false;
        state.token = null;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      });
  },
});

export const { signout } = authSlice.actions;
const reducer = authSlice.reducer;

export default reducer;
