//! imp Library
import Logging from '../library/Logging.js';

//! imp Models
import SubCategory from '../models/SubCategory.js';

export const getSubCategory = async (req, res, next) => {
  try {
    
  } catch (err) {
    Logging.error('Error__ctrls__subCategory: ' + err);
    const error = new Error(err);
    error.httpStatusCode = 400;
    return next(error);
  }
};

export const getSubCaregories = async (req, res, next) => {
  try {
    
  } catch (err) {
    Logging.error('Error__ctrls__subCategory: ' + err);
    const error = new Error(err);
    error.httpStatusCode = 400;
    return next(error);
  }
};

