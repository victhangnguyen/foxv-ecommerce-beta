const createProductSchema = {
  name: {
    notEmpty: {
      errorMessage: 'Name is not empty',
    },
    isLength: {
      options: { min: 3, max: 50 },
      errorMessage:
        'Name should be at least 3 chars long and maximum of 256 chars',
    },
    isAlphanumeric: {
      errorMessage: 'Name should be Alphanumberic',
    },
    trim: true,
  },
  description: {
    isLength: {
      options: { min: 4, max: 1024 },
      errorMessage:
        'Description should be at least 4 chars long and maximum of 1024 chars',
    },
    isAlphanumeric: {
      errorMessage: 'Description should be Alphanumberic',
    },
    trim: true,
  },
  category: {
    notEmpty: {
      errorMessage: 'Cateogry is not empty',
    },
  },
  subCategories: {
    isArray: true,
    notEmpty: {
      errorMessage: 'Sub-category is not empty',
    },
  },
  price: {
    isLength: {
      options: { min: 0, max: 10000000 },
      errorMessage: 'Price should be at least 0 and maximum of 10000000',
    },
  },
  images: {
    isArray: true,
    notEmpty: {
      errorMessage: 'Images is not empty',
    },
  },
};

export default createProductSchema;
