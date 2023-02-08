//! imp Library
import Logging from '../library/Logging.js';

//! imp Models
import Category from '../models/Category.js';
import SubCategory from '../models/SubCategory.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 }).exec();
    res.status(200).json(categories);
  } catch (error) {
    Logging.error('Error__ctrls__SubCategory: ' + error);
    res.status(404).json({ message: error.message });
  }
};

export const getSubCategoriesByCategoryId = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  try {
    const subCategories = await SubCategory.find({ parent: categoryId }).exec();
    res.status(200).json(subCategories);
  } catch (error) {
    Logging.error('Error__ctrls__SubCategory: ' + error);
    res.status(404).json({ message: error.message });
  }
};
