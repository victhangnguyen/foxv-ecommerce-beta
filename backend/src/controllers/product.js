import slugify from 'slugify';
import Logging from '../library/Logging.js';
import config from '../config/index.js';

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

  if (page < 1) {
    page = 1;
  }

  try {
    const products = await Product.find({})
      .sort([
        ['_id', 'desc'],
        [sort, order],
      ])
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();
    res.status(200).json(products);
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    res.status(400).json({ message: error.message });
  }
};

export const createProduct = async (req, res, next) => {
  let images = req.files;
  try {
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

export const updateProduct = async (req, res, next) => {
  const productId = req.params.productId;
  let images = req.files;
  try {
    req.body.slug = slugify(req.body.name);

    let product;
    if (!images.length) {
      product = { ...req.body };
    } else {
      images = images.map((img) => `${baseURL}:${port}/images/${img.filename}`);
      product = { ...req.body, images };
    }

    // let product;
    // if (image?.filename) {
    //   image = 'images/' + image.filename;
    //   product = { ...req.body, image };
    // } else {
    //   product = (({ image, ...rest }) => rest)(req.body);
    // }

    const updatedProduct = await Product.findByIdAndUpdate(productId, product, {
      new: true,
    });

    return res.status(201).json(updatedProduct);
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    res.status(400).json({ message: error.message });
  }
};

export const removeProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const response = await Product.findByIdAndRemove(productId).exec();

    

    res.status(200).json(response);
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    res.status(400).json({ message: error.message });
  }
};

export const removeProducts = async (req, res, next) => {
  const ids = req.query.ids;
  try {
    if (!ids.length) return; //! exists ids

    const deletedProducts = await Product.deleteMany({
      _id: { $in: ids },
    });

    res.status(200).json(deletedProducts);
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    res.status(400).json({ message: error.message });
  }
};

//! Search: Query
const handleSearchQuery = async (req, res, query) => {
  const { sort, order, page, perPage } = req.body;
  try {
    const products = await Product.find({ $text: { $search: query } })
      .sort([
        ['_id', 'desc'],
        [sort, order],
      ])
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate('category', '_id name')
      .populate('subCategories', '_id name')
      .populate('creator', '_id name')
      .exec();

    const productsCount = products.length;

    res.status(200).json({ products, productsCount });
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    res.status(400).json({ message: error.message });
  }
};

export const fetchProductsByFilter = async (req, res, next) => {
  const { search, sort, order, page, perPage } = req.body;
  try {
    if (search.query) {
      return await handleSearchQuery(req, res, search.query);
    }

    if (search.category) {
      return await handleSearchQuery(req, res, search.query);
    }

    //! default
    let products = await Product.find()
      .sort([
        ['_id', 'desc'],
        [sort, order],
      ])
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    const productsCount = await Product.find({})
      .estimatedDocumentCount()
      .exec();

    res.status(200).json({ products, productsCount });
  } catch (error) {}
};
