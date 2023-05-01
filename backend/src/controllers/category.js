import mongoose from 'mongoose';
//! imp Library
import Logging from '../library/Logging.js';
//! imp Utils
import generateSlug from '../utils/generateSlug.js';
import { execWithTransaction } from '../utils/transaction.js';

//! imp Models
import Category from '../models/Category.js';
import Product from '../models/Product.js';

//! imp Services
import categoryService from '../services/categoryService.js';

export async function getCategoryById(req, res, next) {
  const categoryId = req.params.categoryId;

  try {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new Error('Category does not exist!');
    }
    const category = await Category.findById(categoryId).exec();

    if (!category) {
      throw new Error('Category does not exist!');
    }

    res.status(200).json({
      success: true,
      message: 'Fetch a Category by Id successful!',
      data: { category },
    });
  } catch (error) {
    Logging.error('Error__ctrls__category: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export async function getCategoryBySlug(req, res, next) {
  const slug = req.params.slug;
  try {
    const category = await Category.findOne({ slug: slug }).exec();

    if (!category) {
      throw new Error('Category does not exist!');
    }

    const products = await Product.find({ category: category._id });

    res.status(200).json({
      success: true,
      message: 'Fetch a Category by slug successful!',
      data: { category, products },
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

export async function getCategoriesByFilters(req, res, next) {
  const { keyword, sort, order, page, perPage } = req.query;

  let match = {};
  if (keyword) {
    match.$or = [
      { name: new RegExp(keyword, 'i') },
      { slug: new RegExp(keyword, 'i') },
    ];
  }

  const skip = (page - 1) * perPage;

  try {
    const result = await Category.aggregate([
      // {
      //   ! populate
      //   $lookup: {
      //     from: 'roles',
      //     localField: 'roles',
      //     foreignField: '_id',
      //     as: 'roles',
      //   },
      // },
      { $match: match },
      { $sort: { [sort]: +order } },
      { $skip: skip },
      { $limit: +perPage },
      {
        $facet: {
          categories: [
            { $match: match },
            { $sort: { [sort]: +order } },
            { $skip: skip },
            { $limit: +perPage },
          ],
          categoriesCount: [{ $count: 'total' }],
        },
      },
    ]).exec();

    const categories = result[0].categories;
    const categoriesCount = result[0].categoriesCount[0]?.total || 0;

    res.status(200).json({
      success: true,
      messsage: 'Fetch Categories by Filters successful!',
      data: { categories, categoriesCount },
    });
  } catch (error) {
    Logging.error('Error__ctrls__user: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export async function createCategory(req, res, next) {
  const { name } = req.body;
  try {
    const slug = await generateSlug(name, 'Category');

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

export async function updateCategoryById(req, res, next) {
  const categoryId = req.params.categoryId;

  const { name } = req.query;
  try {
    const categoryData = { name };

    const updatedCategory = await execWithTransaction(async (session) => {
      const result = await categoryService.updateCategoryById(
        categoryId,
        categoryData,
        session
      );

      return result;
    });

    res.status(200).json({
      success: true,
      message: 'Update an Category successful!',
      data: { updatedCategory },
    });
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

export const deleteCategoryById = async (req, res, next) => {
  const categoryId = req.query.categoryId;

  try {
    const deletedCategory = await execWithTransaction(async (session) => {
      const result = await categoryService.deleteCategoryById(
        categoryId,
        session
      );

      return result;
    });

    res.status(200).json({
      success: true,
      message: 'Delete a Category successful!',
      data: { deletedCategory: deletedCategory },
    });
  } catch (error) {
    Logging.error('Error__ctrls__category: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};

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
