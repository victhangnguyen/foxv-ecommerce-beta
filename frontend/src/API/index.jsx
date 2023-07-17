import * as orderAPI from './orderAPI';
import * as authAPI from './authAPI';
import * as userAPI from './userAPI';
import * as productAPI from './productAPI';
import * as cartAPI from './cartAPI';
import * as categoryAPI from './categoryAPI';
import * as subCategoryAPI from './subCategoryAPI';

const API = {
  //! authAPI
  auth: authAPI,
  //! categoryAPI
  category: categoryAPI,
  //! subCategoryAPI
  subCategory: subCategoryAPI,
  //! userAPI
  user: userAPI,
  //! productAPI
  product: productAPI,
  //! cartAPI
  cart: cartAPI,
  //! orderAPI
  order: orderAPI,
};

export default API;
