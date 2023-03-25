//! imp Library
import Logging from '../library/Logging.js';
//! imp Utils
import generateSlug from '../utils/generateSlug.js';

//! imp Models
import Category from '../models/Category.js';

export async function getCategoryBySlug(req, res, next) {
  const slug = req.params.slug;
  try {
    const category = await Category.findOne({ slug: slug }).exec();

    if (!category) {
      throw new Error('Category does not exist!');
    }

    res.status(200).json({
      success: true,
      message: 'Fetch a Category by slug successful!',
      data: { category },
    });
  } catch (error) {
    Logging.error('Error__ctrls__category: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export async function getCategories(req, res, next) {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 }).exec();
    res.status(200).json({
      success: true,
      message: 'Fetch all of Categories successful!',
      data: { categories },
    });
  } catch (error) {
    Logging.error('Error__ctrls__category: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export async function createCategory(req, res, next) {
  const { name } = req.body;
  try {
    const slug = await generateSlug(name, 'Category');
    console.log('__Debugger__category\n__createCategory__slug: ', slug, '\n');

    const newCategory = await new Category({
      name,
      slug,
    }).save();

    res.status(201).json({ success: true, data: { category: newCategory } });
  } catch (error) {
    Logging.error('Error__ctrls__category: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export async function updateCategoryBySlug(req, res, next) {
  const slug = req.params.slug;
  const { name } = req.query;
  try {
    const newSlug = await generateSlug(name, 'Category');
    const updatedCategory = await Category.findOneAndUpdate(
      { slug: slug },
      { name, slug: newSlug },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      message: 'Update Category successful!',
      data: { category: updatedCategory },
    });
  } catch (error) {
    Logging.error('Error__ctrls__category: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export const deleteCategoryBySlug = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const deletedCategory = await Category.findOneAndDelete({ slug: slug });
    res.status(200).json({
      success: true,
      message: 'Delete Category successful!',
      data: { category: deletedCategory },
    });
  } catch (error) {
    Logging.error('Error__ctrls__category: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};
