import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';

//! imp Components
import RootComponent from '../components/Layout/RootComponent';
import ErrorScreen from '../features/Error/screens/ErrorScreen';
//! Dashboard
import AdminDashboardScreen from '../features/Admin/screens/AdminDashboardScreen';
//! imp Admin
import AddEditProductScreen from '../features/Product/screens/AddEditProductScreen';
import ManageProductScreen from '../features/Product/screens/ManageProductScreen';

//! imp Routes
import AdminRoute from '../components/Routes/AdminRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootComponent />,
    errorElement: <ErrorScreen />,
    children: [
      //! Admin Route
      {
        path: '/',
        element: <AdminRoute />,
        children: [
          {
            path: '/admin',
            element: <AdminDashboardScreen />,
            children: [
              //! Product Management
              { path: 'products', element: <ManageProductScreen /> },
              { path: 'product', element: <AddEditProductScreen /> },
              { path: 'product/:productId', element: <AddEditProductScreen /> },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
