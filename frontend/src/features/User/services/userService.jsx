import axiosInstance from '../../../services/axiosInstance';
//! imp Utils
import * as urlHandling from '../../../utils/url';

const userService = {
  fetchUsersByFilters: async (params) => {
    const url = `/users/search/filters`;
    const urlQueryParams = urlHandling.queryParam(url, params);
    return axiosInstance.get(urlQueryParams);
  },
  removeUser: async (userId) => {
    const url = `/users/${userId}`;
    return axiosInstance.delete(url);
  },
};
export default userService;
