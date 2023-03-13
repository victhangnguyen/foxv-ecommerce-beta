import axiosInstance from '../../../services/axiosInstance';

const authService = {
  signup: async (data) => {
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
  signin: async (data) => {
    const { username, password } = data;
    const url = `/auth/signin`;
    return axiosInstance.post(url, { username, password });
  },
  refreshToken: async (data) => {
    const { refreshToken } = data;
    const url = `/auth/refresh-token`;
    return axiosInstance.post(url, { refreshToken });
  },
  forgotPassword: async (data) => {
    try {
    } catch (error) {
      console.log('Error: ', error);
    }
  },
};

export default authService;
