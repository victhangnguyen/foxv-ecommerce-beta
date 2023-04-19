export const updateOrderSchema = {
  name: {
    isLength: {
      options: { min: 4, max: 256 },
      errorMessage: 'Address must be between 4 and 256 characters long',
    },
    trim: true,
    notEmpty: {
      errorMessage: 'Name must not be empty',
    },
  },
  address: {
    isLength: {
      options: { max: 256 },
      errorMessage: 'Address must be between 4 and 256 characters long',
    },
    trim: true,
    notEmpty: {
      errorMessage: 'Address must not be empty',
    },
  },
  status: {
    notEmpty: {
      errorMessage: 'Status must not be empty',
    },
  },
};
