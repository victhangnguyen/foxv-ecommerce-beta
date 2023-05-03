import axiosInstance from './axiosInstance';
import * as urlHandling from '../utils/url';

export function getUserById(userId) {
  const url = `/users/${userId}`;
  return axiosInstance.get(url);
}

export function getUsersByFilters(params) {
  const url = `/users/search/filters`;
  const urlQueryParams = urlHandling.serializeQueryParams(url, params);
  return axiosInstance.get(urlQueryParams);
}

export function createUser({
  firstName,
  lastName,
  username,
  email,
  phoneNumber,
}) {
  const userData = { firstName, lastName, username, email, phoneNumber };
  const url = `/admin/users/create`;
  return axiosInstance.post(url, userData);
}

export function deleteUsers(userIds) {
  const url = `/admin/users/delete-multiple`;
  const urlQueryParams = urlHandling.serializeQueryArray(url, userIds);
  return axiosInstance.delete(urlQueryParams);
}

export function resetPasswords(userIds) {
  const url = `/admin/users/password/reset-multiple`;
  const urlQueryParams = urlHandling.serializeQueryArray(url, userIds);
  return axiosInstance.put(urlQueryParams);
}

export function updateUserInfo(
  userId,
  { firstName, lastName, username, email, phoneNumber }
) {
  const userData = {
    firstName,
    lastName,
    username,
    email,
    phoneNumber,
  };
  const url = `/users/${userId}/update`;
  return axiosInstance.put(url, userData);
}

export function updateUserPassword(userId, { password, confirmPassword }) {
  const url = `/users/${userId}/update-password`;
  return axiosInstance.put(url, {
    password,
    confirmPassword,
  });
}

export function updateRole(userId, role) {
  const url = `/admin/users/${userId}/update-role`;
  const urlQueryParams = urlHandling.serializeQueryParams(url, { role });
  return axiosInstance.put(urlQueryParams);
}

// import axiosInstance from '../../../API/axiosInstance';
// //! imp Utils
// import * as urlHandling from '../../../utils/url';

// const userService = {
//   getUser: (userId) => {
//     const url = `/users/${userId}`;
//     return axiosInstance.get(url);
//   },
//   getUsersByFilters: (params) => {
//     const url = `/users/search/filters`;
//     const urlQueryParams = urlHandling.serializeQueryParams(url, params);
//     return axiosInstance.get(urlQueryParams);
//   },
//   //! Private: Admin
//   deleteUsers: (userIds) => {
//     const url = `/admin/users/delete-multiple`;
//     const urlQueryParams = urlHandling.serializeQueryArray(url, userIds);
//     return axiosInstance.delete(urlQueryParams);
//   },
//   //! Private: Admin
//   resetPasswords: (userIds) => {
//     const url = `/admin/users/password/reset-multiple`;
//     const urlQueryParams = urlHandling.serializeQueryArray(url, userIds);
//     return axiosInstance.put(urlQueryParams);
//   },
//   //! Private: Admin
//   updateUserInfo: (userId, dataFields) => {
//     const { firstName, lastName, username, email, phoneNumber } = dataFields;
//     const url = `/admin/users/${userId}/update`;
//     return axiosInstance.put(url, {
//       firstName,
//       lastName,
//       username,
//       email,
//       phoneNumber,
//     });
//   },
//   //! Private: Admin
//   updateUserPassword: (userId, dataFields) => {
//     const { password, confirmPassword } = dataFields;
//     const url = `/admin/users/${userId}/update-password`;
//     return axiosInstance.put(url, {
//       password,
//       confirmPassword,
//     });
//   },
//   //! Private: Admin
//   updateRole: (userId, role) => {
//     const url = `/admin/users/${userId}/update-role`;
//     const urlQueryParams = urlHandling.serializeQueryParams(url, { role });
//     return axiosInstance.put(urlQueryParams);
//   },
// };

// export default userService;
