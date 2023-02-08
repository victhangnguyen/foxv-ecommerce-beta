import axiosInstance from '../../../services/axiosInstance';

const categoryService = {
  getCategories: () => {
    const url = `/categories`;
    return axiosInstance.get(url);
  },
  getSubCategoriesByCategoryId: (categoryId) => {
    const url = `/category/subs/${categoryId}`;
    return axiosInstance.get(url);
  },
};

export default categoryService;
