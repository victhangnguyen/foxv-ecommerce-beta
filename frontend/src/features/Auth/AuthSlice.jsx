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
      console.log('__Debugger__AuthSlice\n__signiup__error: ', error, '\n');
      //! 422
      if (error.response?.status === 422) {
        return thunkAPI.rejectWithValue({
          status: error.response.status,
          success: error.response?.data.success,
          errors: error.response?.data.errors,
        });
      }
      //! 400 - 500
      return thunkAPI.rejectWithValue({
        status: error.response.status,
        success: error.response?.data.success,
        error: error.response.data?.message || error.message,
      });
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
      //! 422
      if (error.response?.status === 422) {
        return thunkAPI.rejectWithValue({
          status: error.response.status,
          success: error.response?.data.success,
          errors: error.response?.data.errors,
        });
      }
      //! 400 - 500
      return thunkAPI.rejectWithValue({
        status: error.response.status,
        success: error.response?.data.success,
        error: error.response.data?.message || error.message,
      });
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
      console.log(
        '__Debugger__AuthSlice\n__refreshToken__response: ',
        response,
        '\n'
      );
      return thunkAPI.fulfillWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        status: error.response.status,
        success: error.response?.data.success,
        error: error.response.data?.message || error.message,
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
        console.log('refreshToken.fulfilled action.payload: ', action.payload);
        state.loading = false;
        state.success = action.payload?.success;
        state.token = action.payload?.data.token;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        console.log('refreshToken.rejected action.payload: ', action.payload);
        state.loading = false;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      });
  },
});

export const { signout } = authSlice.actions;
const reducer = authSlice.reducer;

export default reducer;
