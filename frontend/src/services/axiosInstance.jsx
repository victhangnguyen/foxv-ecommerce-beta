import axios from 'axios';
import Qs from 'qs';

//! imp Actions
import { refreshToken } from '../features/Auth/AuthSlice';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // paramsSerializer: function (params) {
  //   return Qs.stringify(params, { arrayFormat: 'brackets' });
  // },
  paramsSerializer: {
    encode: (params) => Qs.stringify(params, { arrayFormat: 'brackets' }),
  },
});

export const interceptor = (store) => {
  const UNPROCESSABLE = 422;
  const UNAUTHORIZED = 401;
  const FORBIDDEN = 403;
  //! inject store into interceptor
  axiosInstance.interceptors.request.use(
    function (config) {
      let token = store.getState().auth?.token;
      if (token) {
        config.headers.Authorization = `bearer ${token}`;
        // config.headers['x-access-header'] = token;
      }
      return config;
    },
    function (error) {
      // Do something with request error
      console.log('__Debugger__interceptors.request__error: ', error);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    function (response) {
      if (response?.data) {
        return response.data;
      }
      return response;
    },
    async function (error) {
      console.log('__Debugger__interceptors.response__error: ', error);

      let originalConfig = error.config;
      //! No retry when auth/signin
      console.log(
        '__Debugger__axiosInstance\n__interceptior-response__error.response: ',
        error.response,
        '\n'
      );
      if (error.url !== '/auth/signin' && error.response) {
        //! check AccessToken is unauthorized and retry flag
        if (error.response.status === UNAUTHORIZED && !originalConfig._retry) {
          //! toggle flag: true
          originalConfig._retry = true;
          try {
            await store
              .dispatch(
                refreshToken({
                  refreshToken: store.getState().auth.refreshToken,
                })
              )
              .unwrap();
            // return a request with config
            return axiosInstance(originalConfig);
          } catch (err) {
            return Promise.reject(err);
          }
        }
        if (error.response.status === UNAUTHORIZED) {
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
