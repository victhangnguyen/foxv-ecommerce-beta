import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
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

export const signupSchema = {
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
        const user = await User.findOne({ username: value });
        if (user) {
          return Promise.reject('Username already exists');
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
      options: (value, { req, location, path }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject('Email already exists');
          }
        });
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

export const signinSchema = {
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
        
        const user = await mongoose.model('User').findOne({ username: value });
        if (!user) return Promise.reject('Invalid username or password');

        const isMatchPassword = await user.comparePassword(req.body.password);

        if (!isMatchPassword)
          return Promise.reject('Invalid username or password');

        return true;
      },
    },
  },
  password: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Password must not be empty',
    },
  },
};
