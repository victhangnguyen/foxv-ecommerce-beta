import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

//! imp Reducers
import authReducer from '../features/Auth/AuthSlice';
import productReducer from '../features/Product/ProductSlice';
import userReducer from '../features/User/UserSlice';
import searchReducer from '../features/Search/SearchSlice';

const rootPersistConfig = {
  key: 'root',
  version: 1,
  storage: storage, //! redux-persist/lib/storage
  whitelist: [],
};

const authPersistConfig = {
  key: 'auth',
  storage: storage,
  blacklist: ['loading', 'error'],
};

const productPersistConfig = {
  key: 'product',
  storage: storage,
  blacklist: ['loading', 'error'],
};

const cartPersistConfig = {
  key: 'cart',
  storage: storage,
  blacklist: ['loading', 'error', 'success'],
};

const userPersistConfig = {
  key: 'user',
  storage: storage,
  blacklist: ['loading', 'error', 'success'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  product: persistReducer(productPersistConfig, productReducer),
  // cart: persistReducer(cartPersistConfig, cartReducer),
  user: persistReducer(userPersistConfig, userReducer),
  search: searchReducer,
});

export default persistReducer(rootPersistConfig, rootReducer);
