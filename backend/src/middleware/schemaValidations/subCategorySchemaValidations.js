import mongoose from 'mongoose';

export const createSubCategorySchema = {
  categoryId: {
    trim: true,
    notEmpty: {
      errorMessage: 'Category must not be empty',
    },
    custom: {
      options: async (value, { req, location, path }) => {
        const categoryDoc = await mongoose.model('Category').findById(value);
        if (!categoryDoc) {
          return Promise.reject("Category's not valid!");
        }

        return true;
      },
    },
  },
  name: {
    trim: true,
    notEmpty: {
      errorMessage: 'SubCategory Name must not be empty',
    },
    custom: {
      options: async (value, { req, location, path }) => {
        const category = await mongoose
          .model('SubCategory')
          .findOne({ name: value });

        if (category) {
          return Promise.reject("SubCategory's name already exists");
        }

        return true;
      },
    },
    isLength: {
      options: { min: 2, max: 32 },
      errorMessage: 'Last name must be between 2 and 32 characters long',
    },
  },
};

export const updateSubCategorySchema = {
  categoryId: {
    trim: true,
    notEmpty: {
      errorMessage: 'Category must not be empty',
    },
    custom: {
      options: async (value, { req, location, path }) => {
        const categoryDoc = await mongoose.model('Category').findById(value);
        if (!categoryDoc) {
          return Promise.reject("Category's not valid!");
        }

        return true;
      },
    },
  },
  name: {
    trim: true,
    notEmpty: {
      errorMessage: 'SubCategory Name must not be empty',
    },
    custom: {
      options: async (value, { req, location, path }) => {
        const category = await mongoose
          .model('SubCategory')
          .findOne({ name: value });

        if (category) {
          return Promise.reject("SubCategory's name already exists");
        }

        return true;
      },
    },
    isLength: {
      options: { min: 2, max: 32 },
      errorMessage: 'Last name must be between 2 and 32 characters long',
    },
  },
};
