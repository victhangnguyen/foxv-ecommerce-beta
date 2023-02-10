import axios from 'axios';
import Qs from 'qs';

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

axiosInstance.interceptors.response.use(
  function (response) {
    if (response?.data) {
      return response.data;
    }
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log(
      '__Debugger__axiosInstance.interceptors.response__error: ',
      error
    );
    return Promise.reject(error);
  }
);

export default axiosInstance;
