import mongoose from 'mongoose';

export const createCategorySchema = {
  name: {
    trim: true,
    notEmpty: {
      errorMessage: 'Name must not be empty',
    },
    custom: {
      options: async (value, { req, location, path }) => {
        const category = await mongoose
          .model('Category')
          .findOne({ name: value });

        if (category) {
          return Promise.reject("Category's name already exists");
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

export const updateCategorySchema = {
  name: {
    trim: true,
    notEmpty: {
      errorMessage: 'Name must not be empty',
    },
    custom: {
      options: async (value, { req, location, path }) => {
        const category = await mongoose
          .model('Category')
          .findOne({ name: value });

        if (category) {
          return Promise.reject("Category's name already exists");
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
