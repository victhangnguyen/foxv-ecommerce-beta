import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';

//! imp Components
import RootComponent from '../components/Layout/RootComponent';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootComponent />,
    // errorElement: <ErrorScreen />,
  },
]);

export default router;
