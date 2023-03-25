import axiosInstance from '../../../services/axiosInstance';
//! imp Utils
import * as urlHandling from '../../../utils/url';

const categoryService = {
  getCateogryBySlug: (slug) => {
    const url = `/categories/slug/${slug}`;
    return axiosInstance.get(url);
  },
  createCategory: (category) => {
    const { name } = category;
    const url = `/admin/categories/create`;
    return axiosInstance.post(url, { name });
  },
  getCategories: () => {
    const url = `/categories`;
    return axiosInstance.get(url);
  },
  updateCategoryBySlug: (slug, category) => {
    const { name } = category;
    const url = `/admin/categories/slug/${slug}/update-info`;
    const urlQueryParams = urlHandling.queryParam(url, { name });
    return axiosInstance.put(urlQueryParams);
  },
  deleteCategoryBySlug: (slug) => {
    const url = `/admin/categories/slug/${slug}/delete`;
    return axiosInstance.delete(url);
  },
};

export default categoryService;
