import bcrypt from 'bcryptjs';

//! imp Constants
import constants from './constants/index.js';

//! library
import Logging from './library/Logging.js';
import slugify from 'slugify';

import config from './config/index.js';

//! imp Datas
import addressDatas from './data/addressDatas.js';
import fullnameDatas from './data/fullnameDatas.js';
import userDatas from './data/userDatas.js';
import roleDatas from './data/roleDatas.js';
import productDatas from './data/productDatas.js';
import categoryDatas from './data/categoryDatas.js';
import subCategoryDatas from './data/subCategoryDatas.js';
import cartDatas from './data/cartDatas.js';
import orderDatas from './data/orderDatas.js';

//! imp Models
import User from '../src/models/User.js';
import Role from '../src/models/Role.js';
import Product from '../src/models/Product.js';
import Category from '../src/models/Category.js';
import SubCategory from './models/SubCategory.js';
import Cart from './models/Cart.js';
import Order from './models/Order.js';

const importData = async () => {
  try {
    await User.deleteMany();
    await Role.deleteMany();
    await Category.deleteMany();
    await SubCategory.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();

    const users = userDatas.map((user) => ({
      ...user,
      password: bcrypt.hashSync(user.password, 10),
    }));

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

    const userDocs = await User.insertMany(users);
    const roleDocs = await Role.insertMany(roleDatas);
    const productDocs = await Product.insertMany(products);
    const categoryDocs = await Category.insertMany(categories);
    const subCategoryDocs = await SubCategory.insertMany(subCategories);
    const cartDocs = await Cart.insertMany(cartDatas);
    const orderDocs = await Order.insertMany(orderDatas);

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
