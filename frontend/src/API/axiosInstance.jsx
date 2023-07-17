import axios from "axios";
import Qs from "qs";

//! imp Actions
import { refreshToken, signout } from "../features/Auth/AuthSlice";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  // paramsSerializer: function (params) {
  //   return Qs.stringify(params, { arrayFormat: 'brackets' });
  // },
  paramsSerializer: {
    encode: (params) => Qs.stringify(params, { arrayFormat: "brackets" }),
  },
});

export const interceptor = (store) => {
  const UNPROCESSABLE = 422;
  const UNAUTHORIZED = 401;
  const FORBIDDEN = 403;
  //! inject store into interceptor
  axiosInstance.interceptors.request.use(
    function (config) {
      const token = store.getState().auth?.token;
      if (token) {
        config.headers.Authorization = `bearer ${token}`;
        // config.headers['x-access-header'] = token;
      }
      return config;
    },
    function (error) {
      // Do something with request error
      console.log("__Debugger__interceptors.request__error: ", error);
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
      const token = store.getState().auth?.token;
      console.log(
        "__Debugger__axiosInstance\n__interceptors.response__error: ",
        error,
        "\n"
      );
      //! No retry when auth/signin
      if (
        error.response?.config.url !== "/auth/signin" &&
        error.response?.config.url !== "/auth/signup" &&
        error.response?.config.url !== "/auth/forgot-password"
      ) {
        if (!token) return;
        //! check AccessToken is unauthorized and retry flag
        // error instanceof jwt.TokenExpiredError
        //! 403
        if (
          error.response.status === FORBIDDEN &&
          error.response?.data?.message ===
            "Your session has expired. Please log in again to continue using our service."
        ) {
          try {
            /* Return to Stop every thing */
            return store.dispatch(signout());
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
            // return a request with config
            console.log(
              "__Debugger__axiosInstance\n__refreshToken__originalConfig: ",
              originalConfig,
              "\n"
            );
            return axiosInstance(originalConfig);
          } catch (error) {
            // If Promise.reject(err) -> throw this error to handleSubmit
            Promise.reject(error.message);
          }
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
