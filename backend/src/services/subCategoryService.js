import mongoose from 'mongoose';
import generateSlug from '../utils/generateSlug.js';
//! imp Models
import SubCategory from '../models/SubCategory.js';

async function updateSubCategoryById(subCategoryId, subCategoryData, session) {
  const { parent, name } = subCategoryData;

  const newSlug = await generateSlug(name, 'SubCategory');

  const updatedSubCategory = await SubCategory.findByIdAndUpdate(
    subCategoryId,
    { parent, name, slug: newSlug },
    {
      new: true,
      session: session,
    }
  );

  if (!updatedSubCategory) {
    throw new Error('SubCategory does not exist!'); //! Forbidden
  }

  return updatedSubCategory;
}

async function deleteSubCategoryById(subCategoryId, session) {
  const subCategory = await SubCategory.findById(subCategoryId).session(
    session
  );

  if (!subCategory) {
    throw new Error('SubCategory does not exist!'); //! Forbidden
  }

  const deletedSubCategory = await subCategory.remove({ session });

  return deletedSubCategory;
}

export default {
  updateSubCategoryById,
  deleteSubCategoryById,
};
