import slugify from 'slugify';
import Logging from '../library/Logging.js';
import config from '../config/index.js';

//! imp Models
import Product from '../models/Product.js';

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
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    res.status(400).json({ message: error.message });
  }
};

export const productsCount = async (req, res, next) => {
  try {
    const total = await Product.find({}).estimatedDocumentCount().exec();
    console.log('__Debugger__ctrls/product/productsCount__total: ', total);
    res.status(200).json(total);
  } catch (error) {
    Logging.error('Error__ctrls__Category: ' + error);
    res.status(400).json({ message: error.message });
  }
};

//! All of Products with skip and limit
export const getProductList = async (req, res, next) => {
  let { sort, order, page, perPage } = req.body;
  console.log('__Debugger__ctrls/product/getProductList__page: ', page);

  if (page < 1) {
    page = 1;
  }

  try {
    const products = await Product.find({})
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort([[sort, order]])
      .exec();
    res.status(200).json(products);
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    res.status(400).json({ message: error.message });
  }
};

export const createProduct = async (req, res, next) => {
  const baseURL = config.db.server.baseURL;
  const port = config.db.server.port;

  console.log('__Debugger__product\n__createProduct__baseURL: ', baseURL);
  try {
    let images = req.files;
    if (!req.body.category) req.body.category = null;
    req.body.slug = slugify(req.body.name);

    if (images.length < 1) {
      throw new Error('Chưa đính kèm tập tin hình ảnh!');
    }

    // baseURL + port + '/images/' + img.filename
    images = images.map((img) => `${baseURL}:${port}/images/${img.filename}`);

    const product = await Product.create({
      ...req.body,
      images,
      // creator: req.userId, //! creator nên tạo ở backend để bảo mật
    });

    return res.status(201).json(product);
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    res.status(400).json({ message: error.message });
  }
};

export const removeProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    const response = await Product.findByIdAndRemove(productId).exec();

    res.status(200).json(response);
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    res.status(400).json({ message: error.message });
  }
};