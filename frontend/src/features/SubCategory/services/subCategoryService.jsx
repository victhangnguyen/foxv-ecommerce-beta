import axiosInstance from '../../../services/axiosInstance';

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
  // getSubCategory: (slug, config) => {
  //   const url = `/subcategory/${slug}`;
  //   return axiosInstance.get(url, config);
  // },
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
