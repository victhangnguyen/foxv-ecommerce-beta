import axiosInstance from './axiosInstance';
import * as urlHandling from '../utils/url';

export function getSubCategoryById(subCategoryId) {
  const url = `/subcategories/${subCategoryId}`;
  return axiosInstance.get(url);
}

export function getSubCategoryBySlug(slug) {
  const url = `/subcategories/slug/${slug}`;
  return axiosInstance.get(url);
}

export function getSubCategoriesByCategoryId(categoryId) {
  const url = `/subcategories/category/${categoryId}`;
  return axiosInstance.get(url);
}

export function getSubCategories() {
  const url = `/subcategories`;
  return axiosInstance.get(url);
}

export function getSubCategoriesByFilters(filterOptions) {
  // const { keyword, sort, order, page, perPage } = filterOptions;
  const url = `/subcategories/search/filters`;
  const urlQueryParams = urlHandling.serializeQueryParams(url, filterOptions);
  return axiosInstance.get(urlQueryParams);
}

export function createSubCategory(subCategory) {
  const { categoryId, name } = subCategory;
  const url = `/admin/subcategories/create`;
  return axiosInstance.post(url, { categoryId, name });
}

export function updateSubCategoryById(subCategoryId, subCategoryData) {
  const url = `/admin/subcategories/${subCategoryId}/update`;
  return axiosInstance.put(url, subCategoryData);
}

export function updateSubCategoryBySlug(slug, subCategory) {
  const url = `/admin/subcategories/slug/${slug}/update`;
  return axiosInstance.put(url, subCategory);
}

export function deleteSubCategoryById(subCategoryId) {
  const url = `/admin/subcategories/delete-single?subCategoryId=${subCategoryId}`;
  return axiosInstance.delete(url);
}

export function deleteSubCategoryBySlug(slug) {
  const url = `/admin/subcategories/slug/${slug}/delete`;
  return axiosInstance.delete(url);
}
