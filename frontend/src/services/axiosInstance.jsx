import axios from 'axios';
import Qs from 'qs';

//! imp Actions
import { refreshToken, signout } from '../features/Auth/AuthSlice';

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
      // let token = store.getState().auth?.token;
      const token = store.getState().auth?.token;
      console.log('__Debugger__interceptors.request__token: ', token);
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
      let originalConfig = error.config;
      //! No retry when auth/signin
      if (error.url !== '/auth/signin' && error.response) {
        //! check AccessToken is unauthorized and retry flag
        //! 403
        if (error.response.status === FORBIDDEN) {
          try {
            console.log('__Dispatch Acton: Sign Out');
            store.dispatch(signout());
          } catch (error) {
            Promise.reject(error.error);
          }
        }
        //! 401
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
            console.log('refresh-token');
            // return a request with config
            return axiosInstance(originalConfig);
          } catch (error) {
            //! sign out
            // If Promise.reject(err) -> throw this error to handleSubmit
            Promise.reject(error.error);
          }
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
