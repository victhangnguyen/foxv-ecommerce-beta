//! imp Library
import Logging from '../library/Logging.js';

//! imp Models
import SubCategory from '../models/SubCategory.js';

//! imp Utils
import generateSlug from '../utils/generateSlug.js';

export const getSubCategory = async (req, res, next) => {
  try {
  } catch (err) {
    Logging.error('Error__ctrls__subCategory: ' + err);
    const error = new Error(err);
    error.httpStatusCode = 400;
    return next(error);
  }
};

export async function getSubCategoryBySlug(req, res, next) {
  const slug = req.params.slug;
  try {
    const subCategory = await SubCategory.findOne({ slug: slug }).exec();

    if (!subCategory) {
      throw new Error('SubCategory does not exist!');
    }

    res.status(200).json({
      success: true,
      message: 'Fetch a SubCategory by slug successful!',
      data: { subCategory },
    });
  } catch (error) {
    Logging.error('Error__ctrls__category: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export async function getSubCategoriesByCategoryId(req, res, next) {
  const categoryId = req.params.categoryId;
  try {
    const subCategories = await SubCategory.find({ parent: categoryId }).exec();
    res.status(200).json({
      success: true,
      message: 'Fetch all of SubCategories successful!',
      data: { subCategories },
    });
  } catch (error) {
    Logging.error('Error__ctrls__category: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export async function getSubCategories(req, res, next) {
  try {
    const subCategories = await SubCategory.find({})
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json({
      success: true,
      message: 'Fetch all of SubCategories successful!',
      data: { subCategories },
    });
  } catch (error) {
    Logging.error('Error__ctrls__category: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export async function createSubCategory(req, res, next) {
  const { categoryId, name } = req.body;
  try {
    const slug = await generateSlug(name, 'SubCategory');
    const newSubCategory = await new SubCategory({
      name,
      slug,
      parent: categoryId,
    }).save();
    res.status(201).json({
      success: true,
      message: 'Create a SubCategory successful!',
      data: { subCategory: newSubCategory },
    });
  } catch (error) {
    Logging.error('Error__ctrls__category: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export async function updateSubCategoryBySlug(req, res, next) {
  const slug = req.params.slug;
  const { categoryId, name } = req.body;
  try {
    const newSlug = await generateSlug(name, 'SubCategory');
    const updatedSubCategory = await SubCategory.findOneAndUpdate(
      { slug: slug },
      { name, slug: newSlug, parent: categoryId },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      message: 'Update SubCategory successful!',
      data: { subCategory: updatedSubCategory },
    });
  } catch (error) {
    Logging.error('Error__ctrls__category: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export async function deleteSubCategoryBySlug(req, res, next) {
  const { slug } = req.params;
  try {
    const deletedSubCategory = await SubCategory.findOneAndDelete({
      slug: slug,
    });
    res.status(200).json({
      success: true,
      message: 'Delete SubCategory successful!',
      data: { subCategory: deletedSubCategory },
    });
  } catch (error) {
    Logging.error('Error__ctrls__category: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}
