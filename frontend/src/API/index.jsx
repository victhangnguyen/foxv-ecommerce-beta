import * as orderAPI from './orderAPI';
import * as authAPI from './authAPI';
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
  //! productAPI
  product: productAPI,
  //! cartAPI
  cart: cartAPI,
  //! orderAPI
  order: orderAPI,
};

export default API;
