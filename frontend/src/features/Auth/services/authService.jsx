import axiosInstance from '../../../services/axiosInstance';

const authService = {
  signup: (data) => {
    const {
      firstName,
      lastName,
      email,
      username,
      phoneNumber,
      password,
      confirmPassword,
    } = data;
    const url = `/auth/signup`;
    return axiosInstance.post(url, {
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
      password,
      confirmPassword,
    });
  },
  signin: (data) => {
    const { username, password } = data;
    const url = `/auth/signin`;
    return axiosInstance.post(url, { username, password });
  },
  refreshToken: (data) => {
    const { refreshToken } = data;
    const url = `/auth/refresh-token`;
    return axiosInstance.post(url, { refreshToken });
  },
  forgotPassword: (data) => {
    const { email } = data;
    const url = `/auth/forgot-password`;
    return axiosInstance.post(url, { email });
  },
};

export default authService;
