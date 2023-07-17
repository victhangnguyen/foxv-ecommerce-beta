import axiosInstance from './axiosInstance';
import * as urlHandling from '../utils/url';

export function getCategoryById(categoryId) {
  const url = `/categories/${categoryId}`;
  return axiosInstance.get(url);
}

export function getCategoryBySlug(slug) {
  const url = `/categories/slug/${slug}`;
  return axiosInstance.get(url);
}

export function getCategoriesByFilters(filterOptions) {
  // const { keyword, sort, order, page, perPage } = filterOptions
  const url = `/categories/search/filters`;
  const urlQueryParams = urlHandling.serializeQueryParams(url, filterOptions);
  return axiosInstance.get(urlQueryParams);
}

export function getCategories() {
  const url = `/categories`;
  return axiosInstance.get(url);
}

export function createCategory(category) {
  const { name } = category;
  const url = `/admin/categories/create`;
  return axiosInstance.post(url, { name });
}

export function updateCategoryById(categoryId, categoryData) {
  const { name } = categoryData;

  const url = `/admin/categories/${categoryId}/update`;
  const urlQueryParams = urlHandling.serializeQueryParams(url, { name });
  return axiosInstance.put(urlQueryParams);
}

export function updateCategoryBySlug(slug, category) {
  const { name } = category;
  const url = `/admin/categories/slug/${slug}/update`;
  const urlQueryParams = urlHandling.serializeQueryParams(url, { name });
  return axiosInstance.put(urlQueryParams);
}

export function deleteCategoryById(categoryId) {
  const url = `/admin/categories/delete-single?categoryId=${categoryId}`;
  return axiosInstance.delete(url);
}

export function deleteCategoryBySlug(slug) {
  const url = `/admin/categories/slug/${slug}/delete`;
  return axiosInstance.delete(url);
}

