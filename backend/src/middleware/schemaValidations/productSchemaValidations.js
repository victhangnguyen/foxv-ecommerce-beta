//! createProductSchema
export const createProductSchema = {
  name: {
    notEmpty: {
      errorMessage: 'Name must not be empty',
    },
    isLength: {
      options: { min: 2, max: 256 },
      errorMessage:
        'Name must be between 2 and 256 characters long',
    },
    trim: true,
  },
  description: {
    isLength: {
      options: { min: 4, max: 1024 },
      errorMessage:
        'Description must be between 4 and 1024 characters long',
    },
    trim: true,
  },
  category: {
    notEmpty: {
      errorMessage: 'Cateogry must not be empty',
    },
  },
  subCategories: {
    isArray: true,
    notEmpty: {
      errorMessage: 'Sub-category must not be empty',
    },
  },
  price: {
    isLength: {
      options: { min: 0, max: 10000000 },
      errorMessage: 'Price must be between 0 and 10000000 characters long',
    },
  },
  images: {
    isArray: true,
    notEmpty: {
      errorMessage: 'Images must not be empty',
    },
  },
};

//! updateProductSchema
export const updateProductSchema = {
  name: {
    notEmpty: {
      errorMessage: 'Name must not be empty',
    },
    isLength: {
      options: { min: 2, max: 256 },
      errorMessage:
        'Name must be between 2 and 256 characters long',
    },
    trim: true,
  },
  description: {
    isLength: {
      options: { min: 4, max: 1024 },
      errorMessage:
        'Description must be between 4 and 1024 characters long',
    },
    trim: true,
  },
  category: {
    notEmpty: true,
    errorMessage: 'Cateogry must not be empty',
  },
  subCategories: {
    isArray: true,
    notEmpty: true,
    errorMessage: 'Sub-category must not be empty',
  },
  price: {
    isLength: {
      options: { min: 0, max: 10000000 },
      errorMessage: 'Price must be between 0 and 10000000 characters long',
    },
  },
  images: {
    isArray: true,
    notEmpty: false,
  },
};