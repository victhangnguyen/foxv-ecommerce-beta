import express from 'express';
import Logging from '../library/Logging.js';

//! imp models
import Product from '../models/Product.js';
// import Category from '../models/Category.js';
// import SubCategory from '../models/SubCategory.js';

export const getProduct = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId)
      .populate('category')
      .populate('subCategories')
      .exec();
    res.status(200).json(product);
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    res.status(400).json({ message: error.message });
  }
};

export const getProducts = async (req, res, next) => {
  try {
  } catch (error) {}
};
