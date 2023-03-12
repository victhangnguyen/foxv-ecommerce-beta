import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

//! imp Comps/System Handling
import RootComponent from '../components/Layout/RootComponent';
import ErrorScreen from '../features/Error/screens/ErrorScreen';

//! imp Comps/Public
import HomeScreen from '../features/Home/screens/HomeScreen';
import RegisterScreen from '../features/Auth/screens/RegisterScreen';
import LoginScreen from '../features/Auth/screens/LoginScreen';
import PromotionScreen from '../features/Promotion/screens/PromotionScreen';
import ShopScreens from '../features/Shop/screens/ShopScreens';
import ProductDetailScreen from '../features/Product/screens/ProductDetailScreen';
//! imp Comps/Private: Admin
import AdminDashboardScreen from '../features/Admin/screens/AdminDashboardScreen';
import AddEditProductScreen from '../features/Product/screens/AddEditProductScreen';
import ManageProductScreen from '../features/Product/screens/ManageProductScreen';
import ManageUserScreen from '../features/User/screens/ManageUserScreen';
import ManageOrderScreen from '../features/Order/screens/ManageOrderScreen';

//! imp Routes
import AdminRoute from '../components/Routes/AdminRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootComponent />,
    errorElement: <ErrorScreen />,
    children: [
      //! Public Routes
      { index: true, element: <HomeScreen /> },
      { path: '/product/:productId', element: <ProductDetailScreen /> },
      { path: '/promotion', element: <PromotionScreen /> },
      { path: '/shop', element: <ShopScreens /> },
      { path: '/auth/register', element: <RegisterScreen /> },
      { path: '/auth/login', element: <LoginScreen /> },

      //! Private Routes: Admin
      {
        path: '/',
        element: <AdminRoute />,
        children: [
          {
            path: '/admin',
            element: <AdminDashboardScreen />,
            children: [
              //! Product Management
              { path: 'product/:productId', element: <AddEditProductScreen /> },
              { path: 'products', element: <ManageProductScreen /> },
              { path: 'product', element: <AddEditProductScreen /> },
              { path: 'users', element: <ManageUserScreen /> },
              { path: 'orders', element: <ManageOrderScreen /> },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
