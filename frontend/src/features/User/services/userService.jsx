import axios from 'axios';
import axiosInstance from '../../../API/axiosInstance';
//! imp Utils
import * as urlHandling from '../../../utils/url';

const userService = {
  getUser: (userId) => {
    const url = `/users/${userId}`;
    return axiosInstance.get(url);
  },
  getUsersByFilters: (params) => {
    const url = `/users/search/filters`;
    const urlQueryParams = urlHandling.queryParam(url, params);
    return axiosInstance.get(urlQueryParams);
  },
  //! Private: Admin
  deleteUsers: (userIds) => {
    const idPairs = urlHandling.queryIds(userIds);
    const url = `/admin/users/delete-multiple?${idPairs}`;
    return axiosInstance.delete(url);
  },
  //! Private: Admin
  resetPasswords: (userIds) => {
    const idPairs = urlHandling.queryIds(userIds);
    const url = `/admin/users/password/reset-multiple?${idPairs}`;
    return axiosInstance.put(url);
  },
  //! Private: Admin
  updateUserInfo: (userId, dataFields) => {
    const { firstName, lastName, username, email, phoneNumber } = dataFields;
    const url = `/admin/users/${userId}/update-info`;
    return axiosInstance.put(url, {
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
    });
  },
  //! Private: Admin
  updateUserPassword: (userId, dataFields) => {
    const { password, confirmPassword } = dataFields;
    const url = `/admin/users/${userId}/update-password`;
    return axiosInstance.put(url, {
      password,
      confirmPassword,
    });
  },
  //! Private: Admin
  updateRole: (userId, role) => {
    const url = `/admin/users/${userId}/update-role`;
    const urlQueryParams = urlHandling.queryParam(url, { role });
    return axiosInstance.put(urlQueryParams);
  },
};

export default userService;
