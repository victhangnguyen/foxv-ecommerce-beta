import mongoose from 'mongoose';
//! imp Models
import User from '../../models/User.js';

//! String contains only letters
const isLetter = (value) => {
  const unicodeLetters = /^[A-Za-z\u00C0-\u024F\u1E00-\u1EFF ]+$/; //! Matches any ASCII letters or Unicode letters (including accented letters, etc.)
  return unicodeLetters.test(value);
};
const isAlphaNumberLetter = (value) => {
  const alphanumbericLetters = /^[a-zA-Z0-9]+$/; //! Matches Alphanumberic
  return alphanumbericLetters.test(value);
};

export const updateUserInfoSchema = {
  username: {
    trim: true,
    notEmpty: {
      errorMessage: 'Username must not be empty',
    },
    custom: {
      options: async (value, { req, location, path }) => {
        if (!isAlphaNumberLetter(value)) {
          throw new Error('Username may only contain alphanumeric characters');
        }
        const user = await User.findById(req.params.userId);

        if (value !== user.username) {
          const user = await User.findOne({ username: value });

          if (user) {
            throw new Error('Username already exists');
          }
        }
        return true;
      },
    },
    isLength: {
      options: { min: 8, max: 64 },
      errorMessage: 'Username must be between 8 and 64 characters long',
    },
    // Custom validators
  },
  email: {
    trim: true,
    notEmpty: {
      errorMessage: 'Email must not be empty',
    },
    isEmail: {
      errorMessage: 'Invalid email address',
    },
    // Custom validators
    custom: {
      options: async (value, { req, location, path }) => {
        const user = await User.findById(req.params.userId);

        if (value !== user.email) {
          const user = await User.findOne({ email: value });
          if (user) {
            throw new Error('Username already exists');
          }
        }
        return true;
      },
    },
  },
  firstName: {
    trim: true,
    notEmpty: {
      errorMessage: 'First name must not be empty',
    },
    custom: {
      options: (value, { req, location, path }) => {
        if (!isLetter(value)) {
          throw new Error('First name must contain only letters');
        }
        return true;
      },
    },
    isLength: {
      options: { min: 2, max: 32 },
      errorMessage: 'First name must be between 2 and 32 characters long',
    },
  },
  lastName: {
    trim: true,
    notEmpty: {
      errorMessage: 'Last name must not be empty',
    },
    custom: {
      options: (value, { req, location, path }) => {
        if (!isLetter(value)) {
          throw new Error('Last name must contain only letters');
        }
        return true;
      },
    },
    isLength: {
      options: { min: 2, max: 32 },
      errorMessage: 'Last name must be between 2 and 32 characters long',
    },
  },
  phoneNumber: {
    trim: true,
    notEmpty: {
      errorMessage: 'Phone Number must not be empty',
    },
    isNumeric: {
      errorMessage: 'Phone Number must be numeric',
    },
    isLength: {
      options: { min: 8, max: 32 },
      errorMessage: 'Phone Number must be between 8 and 32 characters long',
    },
    errorMessage: 'Invalid phone number',
  },
};

export const updateUserPasswordSchema = {
  password: {
    trim: true,
    notEmpty: {
      errorMessage: 'Password must not be empty',
    },
    custom: {
      options: async (value, { req, location, path }) => {
        const userId = req.params.userId;

        const user = await mongoose.model('User').findById(userId);

        const isMatchPassword = await user.comparePassword(value);

        if (isMatchPassword) {
          return Promise.reject(
            'The new password cannot be the same as the old password. Please choose a different password.'
          );
        }

        return true;
      },
    },
  },
};
