import mongoose from 'mongoose';
import generateSlug from '../utils/generateSlug.js';
//! imp Models
import Category from '../models/Category.js';

async function updateCategoryById(categoryId, categoryData, session) {
  const { name } = categoryData;

  const newSlug = await generateSlug(name, 'Category');

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    { name, slug: newSlug },
    {
      new: true,
      session: session,
    }
  );

  if (!updatedCategory) {
    throw new Error('Category does not exist!'); //! Forbidden
  }

  return updatedCategory;
}

async function deleteCategoryById(categoryId, session) {
  const category = await Category.findById(categoryId).session(session);

  if (!category) {
    throw new Error('Category does not exist!'); //! Forbidden
  }

  const deletedCategory = await category.remove({ session });

  return deletedCategory;
}

export default {
  updateCategoryById,
  deleteCategoryById,
};
