import axiosInstance from '../API/axiosInstance';

export function signup(userData) {
  const {
    firstName,
    lastName,
    email,
    username,
    phoneNumber,
    password,
    confirmPassword,
  } = userData;
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
}

export function signin(userData) {
  const { username, password } = userData;
  const url = `/auth/signin`;
  return axiosInstance.post(url, { username, password });
}

export function refreshToken(token) {
  const url = `/auth/refresh-token`;
  return axiosInstance.post(url, { refreshToken: token });
}

export function forgotPassword(data) {
  const { email } = data;
  const url = `/auth/forgot-password`;
  return axiosInstance.post(url, { email });
}
