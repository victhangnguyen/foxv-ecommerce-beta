import axiosInstance from '../../../API/axiosInstance';
//! imp Utils
import * as urlHandling from '../../../utils/url';

const subCategoryService = {
  getSubCategoryBySlug: (slug) => {
    const url = `/subcategories/slug/${slug}`;
    return axiosInstance.get(url);
  },
  getSubCategoriesByCategoryId: (categoryId) => {
    const url = `/subcategories/category/${categoryId}`;
    return axiosInstance.get(url);
  },
  getSubCategories: () => {
    const url = `/subcategories`;
    return axiosInstance.get(url);
  },
  getSubCategoriesByFilters: (filterOptions) => {
    // const { keyword, sort, order, page, perPage } = filterOptions
    const url = `/subcategories/search/filters`;
    const urlQueryParams = urlHandling.serializeQueryParams(url, filterOptions);
    return axiosInstance.get(urlQueryParams);
  },
  createSubCategory: (subCategory) => {
    const { categoryId, name } = subCategory;
    const url = `/admin/subcategories/create`;
    return axiosInstance.post(url, { categoryId, name });
  },
  updateSubCategoryBySlug: (slug, subCategory) => {
    const url = `/admin/subcategories/slug/${slug}/update-info`;
    return axiosInstance.put(url, subCategory);
  },
  deleteSubCategoryBySlug: (slug) => {
    const url = `/admin/subcategories/slug/${slug}/delete`;
    return axiosInstance.delete(url);
  },
};

export default subCategoryService;
