import express from 'express';
import * as categoryController from '../controllers/category.js';

const router = express.Router();

//! @desc     Fetch all Categories
//! @route    GET /api/categories
//! @access   Public
router.get('/categories', categoryController.getCategories);

router.get('/category/subs/:categoryId', categoryController.getSubCategoriesByCategoryId);

export default router;