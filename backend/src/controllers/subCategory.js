import mongoose from "mongoose";
//! imp Library
import Logging from "../library/Logging.js";

//! imp Models
import SubCategory from "../models/SubCategory.js";
import Product from "../models/Product.js";

//! imp Utils
import generateSlug from "../utils/generateSlug.js";
import { execWithTransaction } from "../utils/transaction.js";

//! imp Services
import subCategoryService from "../services/subCategoryService.js";

export async function getSubCategoryById(req, res, next) {
  const subCategoryId = req.params.subCategoryId;

  try {
    if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
      throw new Error("SubCategory does not exist!");
    }

    const subCategory = await SubCategory.findById(subCategoryId).exec();

    if (!subCategory) {
      throw new Error("SubCategory does not exist!");
    }

    res.status(200).json({
      success: true,
      message: "Fetch a SubCategory by Id successful!",
      data: { subCategory },
    });
  } catch (error) {
    Logging.error("Error__ctrls__subCategory: " + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export async function getSubCategoryBySlug(req, res, next) {
  const slug = req.params.slug;
  try {
    const subCategory = await SubCategory.findOne({ slug: slug }).exec();

    if (!subCategory) {
      throw new Error("SubCategory does not exist!");
    }

    const products = await Product.find({ subCategories: subCategory }).exec();

    res.status(200).json({
      success: true,
      message: "Fetch a SubCategory by slug successful!",
      data: { subCategory, products },
    });
  } catch (error) {
    Logging.error("Error__ctrls__subCategory: " + error);
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
      message: "Fetch all of SubCategories successful!",
      data: { subCategories },
    });
  } catch (error) {
    Logging.error("Error__ctrls__subCategory: " + error);
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
      message: "Fetch all of SubCategories successful!",
      data: { subCategories },
    });
  } catch (error) {
    Logging.error("Error__ctrls__subCategory: " + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export async function getSubCategoriesByFilters(req, res, next) {
  const { keyword, sort, order, page, perPage } = req.query;
  let match = {};
  if (keyword) {
    match.$or = [
      { name: new RegExp(keyword, "i") },
      { slug: new RegExp(keyword, "i") },
    ];
  }

  const skip = (page - 1) * perPage;

  try {
    const result = await SubCategory.aggregate([
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
          subCategories: [
            { $match: match },
            { $sort: { [sort]: +order } },
            { $skip: skip },
            { $limit: +perPage },
          ],
          subCategoriesCount: [{ $count: "total" }],
        },
      },
    ]).exec();

    const subCategories = result[0].subCategories;
    const subCategoriesCount = result[0].subCategoriesCount[0]?.total || 0;

    res.status(200).json({
      success: true,
      messsage: "Fetch SubCategories by Filters successful!",
      data: { subCategories, subCategoriesCount },
    });
  } catch (error) {
    Logging.error("Error__ctrls__user: " + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export async function createSubCategory(req, res, next) {
  const { parent, name } = req.body;
  console.log(
    "__Debugger__subCategory\n__createSubCategory__req.body: ",
    req.body,
    "\n"
  );
  try {
    const slug = await generateSlug(name, "SubCategory");
    const newSubCategory = await new SubCategory({
      name,
      slug,
      parent,
    }).save();
    res.status(201).json({
      success: true,
      message: "Create a SubCategory successful!",
      data: { subCategory: newSubCategory },
    });
  } catch (error) {
    Logging.error("Error__ctrls__subCategory: " + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export async function updateSubCategoryById(req, res, next) {
  const subCategoryId = req.params.subCategoryId;
  const subCategoryData = {
    name: req.body.name,
    parent: req.body.parent,
  };
  try {
    if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
      throw new Error("SubCategory does not exist!");
    }

    const updatedSubCategory = await execWithTransaction(async (session) => {
      const result = await subCategoryService.updateSubCategoryById(
        subCategoryId,
        subCategoryData,
        session
      );

      return result;
    });

    res.status(200).json({
      success: true,
      message: "Update a SubCategory successful!",
      data: { updatedSubCategory },
    });
  } catch (error) {
    Logging.error("Error__ctrls__subCategory: " + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export async function updateSubCategoryBySlug(req, res, next) {
  const slug = req.params.slug;
  const { categoryId, name } = req.body;
  try {
    const newSlug = await generateSlug(name, "SubCategory");
    const updatedSubCategory = await SubCategory.findOneAndUpdate(
      { slug: slug },
      { name, slug: newSlug, parent: categoryId },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "Update SubCategory successful!",
      data: { subCategory: updatedSubCategory },
    });
  } catch (error) {
    Logging.error("Error__ctrls__subCategory: " + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export async function deleteSubCategoryById(req, res, next) {
  const subCategoryId = req.query.subCategoryId;
  try {
    const deletedSubCategory = await execWithTransaction(async (session) => {
      const result = await subCategoryService.deleteSubCategoryById(
        subCategoryId
      );

      return result;
    });

    res.status(200).json({
      success: true,
      message: "Delete a SubCategory successful!",
      data: { deletedSubCategory },
    });
  } catch (error) {
    Logging.error("Error__ctrls__subCategory: " + error);
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
      message: "Delete SubCategory successful!",
      data: { subCategory: deletedSubCategory },
    });
  } catch (error) {
    Logging.error("Error__ctrls__subCategory: " + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}
