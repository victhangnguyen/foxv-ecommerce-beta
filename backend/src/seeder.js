//! library
import Logging from './library/Logging.js';
import slugify from 'slugify';

import config from './config/index.js';

//! imp Datas
import userDatas from './data/userDatas.js';
import productDatas from './data/productDatas.js';
import categoryDatas from './data/categoryDatas.js';
import subCategoryDatas from './data/subCategoryDatas.js';

//! imp Models
import User from '../src/models/User.js';
import Product from '../src/models/Product.js';
import Category from '../src/models/Category.js';
import SubCategory from './models/SubCategory.js';

const importData = async () => {
  try {
    await User.deleteMany();
    await Category.deleteMany();
    await SubCategory.deleteMany();
    await Product.deleteMany();

    const categories = categoryDatas.map((category) => ({
      ...category,
      slug: slugify(category.name),
    }));

    const subCategories = subCategoryDatas.map((sub) => ({
      ...sub,
      slug: slugify(sub.name),
    }));

    const products = productDatas.map((product) => ({
      ...product,
      slug: slugify(product.name),
    }));

    const userDocs = await User.insertMany(userDatas);
    const productDocs = await Product.insertMany(products);
    const categoryDocs = await Category.insertMany(categories);
    const subCategoryDocs = await SubCategory.insertMany(subCategories);

    Logging.log('Data Imported!!!');
    process.exit();
  } catch (error) {
    Logging.error(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    Logging.error('Data Destroyed!!!');
    process.exit();
  } catch (error) {
    Logging.error(error);
    process.exit(1);
  }
};

config.db
  .connectMongoDB()
  .then((connection) => {
    //! seeder -d
    if (process.argv[2] === '-d') {
      destroyData();
    } else {
      importData();
    }
  })
  .catch((error) => {
    console.log(error);
  });
