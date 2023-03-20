//! imp Library
import Logging from '../library/Logging.js';

//! imp Models
import Category from '../models/Category.js';
import SubCategory from '../models/SubCategory.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 }).exec();
    res.status(200).json(categories);
  } catch (err) {
    Logging.error('Error__ctrls__category: ' + err);
    const error = new Error(err);
    error.httpStatusCode = 400;
    return next(error);
  }
};

export const getSubCategoriesByCategoryId = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  try {
    const subCategories = await SubCategory.find({ parent: categoryId }).exec();
    res.status(200).json(subCategories);
  } catch (err) {
    Logging.error('Error__ctrls__category: ' + err);
    const error = new Error(err);
    error.httpStatusCode = 400;
    return next(error);
  }
};
