import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
//! imp config
import config from '../../config/index.js';

export const updateUserPassword = {
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
