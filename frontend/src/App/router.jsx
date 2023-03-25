import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

//! imp Comps/System Handling
import RootComponent from '../components/Layout/RootComponent';
import ErrorScreen from '../features/Error/screens/ErrorScreen';

//! imp Comps/Public
import HomeScreen from '../features/Home/screens/HomeScreen';
import RegisterScreen from '../features/Auth/screens/RegisterScreen';
import LoginScreen from '../features/Auth/screens/LoginScreen';
import ForgotPasswordScreen from '../features/Auth/screens/ForgotPasswordScreen';
import PromotionScreen from '../features/Promotion/screens/PromotionScreen';
import ProductDetailScreen from '../features/Product/screens/ProductDetailScreen';
//! imp Collections
import ShopScreens from '../features/Shop/screens/ShopScreens';
import CategoryCreateScreen from '../features/Category/screens/CategoryCreateScreen';
import CategoryUpdateScreen from '../features/Category/screens/CategoryUpdateScreen';
import SubCategoryCreateScreen from '../features/SubCategory/screens/SubCategoryCreateScreen';
import SubCategoryUpdateScreen from '../features/SubCategory/screens/SubCategoryUpdateScreen';
import SubCollectionScreen from '../features/Collection/screens/SubCollectionScreen';
import CollectionScreen from '../features/Collection/screens/CollectionScreen';
//! imp Comps/Private: User
import UserDashboardScreen from '../features/User/screens/UserDashboardScreen';
import CartScreen from '../features/Cart/screens/CartScreen';
import AddEditUserScreen from '../features/User/screens/AddEditUserScreen';
//! imp Comps/Private: Admin
import AdminDashboardScreen from '../features/Admin/screens/AdminDashboardScreen';
import AddEditProductScreen from '../features/Product/screens/AddEditProductScreen';
import ManageProductScreen from '../features/Product/screens/ManageProductScreen';
import ManageUserScreen from '../features/User/screens/ManageUserScreen';
import ManageOrderScreen from '../features/Order/screens/ManageOrderScreen';

//! imp Routes
import AdminRoute from '../components/Routes/AdminRoute';
import UserRoute from '../components/Routes/UserRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootComponent />,
    errorElement: <ErrorScreen />,
    children: [
      //! Public Routes
      { index: true, element: <HomeScreen /> },
      { path: '/products/:productId', element: <ProductDetailScreen /> },
      { path: '/promotion', element: <PromotionScreen /> },
      { path: '/shop', element: <ShopScreens /> },
      { path: '/auth/register', element: <RegisterScreen /> },
      { path: '/auth/login', element: <LoginScreen /> },
      { path: '/auth/forgot-password', element: <ForgotPasswordScreen /> },
      //! Private Routes: User
      {
        path: 'users/:userId',
        element: <UserRoute />,
        children: [
          { path: 'cart', element: <CartScreen /> },
          {
            path: '',
            element: <UserDashboardScreen />,
            children: [{ path: 'update', element: <AddEditUserScreen /> }],
          },
        ],
      },
      //! Private Routes: Admin
      {
        // path: '/',
        path: '',
        element: <AdminRoute />,
        children: [
          {
            // path: '/admin',
            path: 'admin',
            element: <AdminDashboardScreen />,
            children: [
              //! Product Management
              { path: 'users', element: <ManageUserScreen /> }, //! users management
              { path: 'users/create', element: <AddEditUserScreen /> },
              { path: 'users/:userId/update', element: <AddEditUserScreen /> },
              { path: 'products', element: <ManageProductScreen /> }, //! products management
              { path: 'products/create', element: <AddEditProductScreen /> },
              {
                path: 'products/:productId/update',
                element: <AddEditProductScreen />,
              },
              { path: 'categories/create', element: <CategoryCreateScreen/> },
              { path: 'categories/:slug/update', element: <CategoryUpdateScreen/> },
              { path: 'subcategories/create', element: <SubCategoryCreateScreen/> },
              { path: 'subcategories/:slug/update', element: <SubCategoryUpdateScreen/> },
              { path: 'orders', element: <ManageOrderScreen /> },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
