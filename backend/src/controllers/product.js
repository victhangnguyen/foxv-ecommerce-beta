import slugify from 'slugify';
import config from '../config/index.js';
import path from 'path';
import { validationResult } from 'express-validator';

//! imp Library
import Logging from '../library/Logging.js';

//! imp Utils
import * as fileHelper from '../utils/file.js';

//! imp Models
import Product from '../models/Product.js';

const baseURL = config.db.server.baseURL;
const port = config.db.server.port;

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
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};

export const getProducts = async (req, res, next) => {
  try {
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};

export const productsCount = async (req, res, next) => {
  try {
    const total = await Product.find({}).estimatedDocumentCount().exec();
    console.log('__Debugger__ctrls/product/productsCount__total: ', total);
    res.status(200).json(total);
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};

//! All of Products with skip and limit
export const getProductList = async (req, res, next) => {
  console.log('__Debugger__product\n__getProductList__req.query: ', req.query, '\n');
  let { sort, order, page, perPage } = req.query;

  if (page < 1) {
    page = 1;
  }

  try {
    const products = await Product.find({})
      .sort([
        [sort, order],
        ['_id', 'desc'],
      ])
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    res.status(200).json(products);
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};

export const createProduct = async (req, res, next) => {
  let images = req.files;
  try {
    //! Error Handling
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(
        '__Debugger__product\n__createProduct__errors: ',
        errors,
        '\n'
      );
      console.log(errors);
      // throw new Error()
    }

    if (!req.body.category) req.body.category = null;
    req.body.slug = slugify(req.body.name);

    if (images.length < 1) {
      throw new Error('Chưa đính kèm tập tin hình ảnh!');
    }

    images = images.map((img) => img.filename);

    const product = await Product.create({
      ...req.body,
      images,
      // creator: req.userId, //! creator nên tạo ở backend để bảo mật
    });

    return res.status(201).json(product);
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  //! Frontend put Empty Array or Image Array
  const productId = req.params.productId;
  let { images, ...otherProps } = req.body;

  console.log('__Debugger__product\n__updateProduct__images: ', images, '\n');
  try {
    let newProduct;
    req.body.slug = slugify(req.body.name);

    const isExistImages = images.length;
    if (isExistImages) {
      images = images.map((img) => img.filename);
      newProduct = { ...otherProps, images };
      //! Delete old-images
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found!');
      }

      const fileDir = path.join(fileHelper.rootDir, 'images', 'products');
      const files = product.images;

      const deletedFiles = await fileHelper.deleteFiles(fileDir, files);
      Logging.info(deletedFiles);
    } else {
      newProduct = { ...otherProps };
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      newProduct,
      {
        new: true,
      }
    );

    return res.status(201).json(updatedProduct);
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};

export const removeProduct = async (req, res, next) => {
    const productId = req.params.productId;

    try {
      //! delete database -> delete Files
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found!');
      }

      const fileDir = path.join(fileHelper.rootDir, 'images', 'products');
      const files = product.images;

      const deletedFiles = await fileHelper.deleteFiles(fileDir, files);
      Logging.info(deletedFiles);

      const response = await Product.findByIdAndRemove(productId).exec();

      res.status(200).json(response);
    } catch (error) {
      Logging.error('Error__ctrls__product: ' + error);
      const err = new Error(error);
      err.statusCode = 400;
      return next(err);
    }
};

export const removeProducts = async (req, res, next) => {
  const productIds = req.query.ids;
  console.log('productIds: ', productIds);
  try {
    if (!productIds.length) return; //! exists productIds

    const deletedProductQuene = productIds.map((productId) => {
      return new Promise((resolve, reject) => {
        Product.findById(productId).then((productDoc) => {
          if (!productDoc) {
            reject('Product not found!');
          }
          const fileDir = path.join(fileHelper.rootDir, 'images', 'products');
          const files = productDoc.images;

          fileHelper
            .deleteFiles(fileDir, files)
            .then((deletedFiles) => {
              resolve(deletedFiles);
            })
            .catch((error) => {
              console.log(error);
            });
        });
      }).catch((error) => {
        console.log(error);
      });
    });

    await Promise.all(deletedProductQuene)
      .then((deletedFile) => {
        Logging.info(deletedFile);
      })
      .catch((error) => {
        Logging.error(error);
      });

    const deletedProducts = await Product.deleteMany({
      _id: { $in: productIds },
    });

    res.status(200).json(deletedProducts);
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};

//! Search: Query
const handleSearchQuery = async (req, res, next) => {
  const { search, sort, order, page, perPage } = req.body;
  try {
    const products = await Product.find({ $text: { $search: search.text } })
      .populate('category', '_id name')
      .populate('subCategories', '_id name')
      .populate('creator', '_id name')
      .sort([
        [sort, order],
        ['_id', 'desc'],
      ])
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    const productsCount = await Product.find({
      $text: { $search: search.text },
    }).count();

    return res.status(200).json({ products, productsCount });
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    res.status(400).json({ message: error.message });
  }
};

//! Search: Price
const handleSearchPrice = async (req, res, next) => {
  const { search, sort, order, page, perPage } = req.body;
  try {
    const priceGte = search.price.split('-')[0];
    const priceLte = search.price.split('-')[1];

    const products = await Product.find({
      price: {
        $gte: priceGte,
        $lte: priceLte,
      },
    })
      .populate('category', '_id name')
      .populate('subCategories', '_id name')
      .populate('creator', '_id name')
      .sort([
        [sort, order],
        ['_id', 'desc'],
      ])
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    const productsCount = await Product.find({
      price: {
        $gte: priceGte,
        $lte: priceLte,
      },
    }).count();

    return res.status(200).json({ products, productsCount });
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};

//! Search: Category
const handleSearchCategory = async (req, res, next) => {
  const { search, sort, order, page, perPage } = req.body;
  const categoryId = search.category;
  try {
    const products = await Product.find({ category: categoryId })
      .populate('category', '_id name')
      .populate('subCategories', '_id name')
      .populate('creator', '_id name')
      .sort([
        [sort, order],
        ['_id', 'desc'],
      ])
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    const productsCount = await Product.find({ category: categoryId }).count();

    return res.status(200).json({ products, productsCount });
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};

export const fetchProductsByFilters = async (req, res, next) => {
  const { search, sort, order, page, perPage } = req.body;
  try {
    if (search.text) {
      return await handleSearchQuery(req, res, next);
    }
    if (search.price) {
      return await handleSearchPrice(req, res, next);
    }
    if (search.category) {
      return await handleSearchCategory(req, res, next);
    }

    //! default
    let products = await Product.find()
      .sort([
        [sort, order],
        ['_id', 'desc'],
      ])
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    const productsCount = await Product.find({})
      .estimatedDocumentCount()
      .exec();

    res.status(200).json({ products, productsCount });
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};
