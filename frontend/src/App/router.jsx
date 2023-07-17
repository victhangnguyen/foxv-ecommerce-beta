import React from "react";
import { createBrowserRouter } from "react-router-dom";

//! imp Comps/System Handling
import RootComponent from "../components/Layout/RootComponent";
import ErrorScreen from "../features/Error/screens/ErrorScreen";

//! imp Comps/Public
import HomeScreen from "../features/Home/screens/HomeScreen";
import RegisterScreen from "../features/Auth/screens/RegisterScreen";
import LoginScreen from "../features/Auth/screens/LoginScreen";
import ForgotPasswordScreen from "../features/Auth/screens/ForgotPasswordScreen";
import PromotionScreen from "../features/Promotion/screens/PromotionScreen";
import ProductDetailScreen from "../features/Product/screens/ProductDetailScreen";
//! imp Collections
import ShopScreens from "../features/Shop/screens/ShopScreens";
import CategoryCreateScreen from "../features/Category/screens/CategoryCreateScreen";
import CategoryUpdateScreen from "../features/Category/screens/CategoryUpdateScreen";
import SubCategoryCreateScreen from "../features/SubCategory/screens/SubCategoryCreateScreen";
import SubCategoryUpdateScreen from "../features/SubCategory/screens/SubCategoryUpdateScreen";
import SubCollectionScreen from "../features/Collection/screens/SubCollectionScreen";
import CollectionScreen from "../features/Collection/screens/CollectionScreen";
//! imp Comps/Private: User
import UserDashboardScreen from "../features/User/screens/UserDashboardScreen";
import CartScreen from "../features/Cart/screens/CartScreen";
import AddEditOrderScreen from "../features/Order/screens/AddEditOrderScreen";
import HistoryOrderScreen from "../features/Order/screens/HistoryOrderScreen";
import AddEditUserScreen from "../features/User/screens/AddEditUserScreen";
import CheckoutPaymentScreen from "../features/Payment/screens/CheckoutPaymentScreen";
//! imp Comps/Private: Admin
import AdminDashboardScreen from "../features/Admin/screens/AdminDashboardScreen";
import AddEditProductScreen from "../features/Product/screens/AddEditProductScreen";
import ManageProductScreen from "../features/Product/screens/ManageProductScreen";
import ManageUserScreen from "../features/User/screens/ManageUserScreen";
import ManageOrderScreen from "../features/Order/screens/ManageOrderScreen";
import OrderCreateScreen from "../features/Order/screens/OrderCreateScreen";

//! imp Routes
import AdminRoute from "../components/Routes/AdminRoute";
import UserRoute from "../components/Routes/UserRoute";

const router = createBrowserRouter([
  {
    path: "",
    element: <RootComponent />,
    errorElement: <ErrorScreen />,
    children: [
      //! Public Routes
      { index: true, element: <HomeScreen /> },
      { path: "products/:slug", element: <ProductDetailScreen /> },
      { path: "promotion", element: <PromotionScreen /> },
      { path: "shop", element: <ShopScreens /> },
      { path: "auth/register", element: <RegisterScreen /> },
      { path: "auth/login", element: <LoginScreen /> },
      { path: "auth/forgot-password", element: <ForgotPasswordScreen /> },
      { path: "collections/:slug", element: <CollectionScreen /> }, //! catSlug
      { path: "collections/sub/:slug", element: <SubCollectionScreen /> }, //! subSlug
      {
        path: "cart",
        children: [
          { index: true, path: "", element: <CartScreen /> },
          { path: ":productId", element: <CartScreen /> },
        ],
      },
      //! Required User
      {
        path: "",
        element: <UserRoute />,
        children: [],
      },
      //! Private User
      {
        path: "",
        element: <UserRoute privateProtect={true} />,
        children: [
          {
            path: "users/:userId",
            element: <UserDashboardScreen />,
            children: [
              { path: "update", element: <AddEditUserScreen /> },
              { path: "history-orders", element: <HistoryOrderScreen /> },
            ],
          },
          {
            path: "users/:userId",
            children: [
              { path: "checkout", element: <CheckoutPaymentScreen /> },
              { path: "orders/:orderId", element: <AddEditOrderScreen /> },
            ],
          },
        ],
      },
      //! Private Routes: Admin
      {
        // path: '/',
        path: "",
        element: <AdminRoute />,
        children: [
          {
            // path: '/admin',
            path: "admin",
            element: <AdminDashboardScreen />,
            children: [
              //! /admin/users
              { path: "users", element: <ManageUserScreen /> }, //! users management
              { path: "users/create", element: <AddEditUserScreen /> },
              { path: "users/:userId/update", element: <AddEditUserScreen /> },
              //! /admin/products
              { path: "products", element: <ManageProductScreen /> }, //! products management
              { path: "products/create", element: <AddEditProductScreen /> },
              {
                path: "products/:productId/update",
                element: <AddEditProductScreen />,
              },
              //! /admin/orders
              { path: "orders", element: <ManageOrderScreen /> },
              { path: "orders/create", element: <OrderCreateScreen /> },
              {
                path: "orders/:orderId/update",
                element: <AddEditOrderScreen />,
              },
              //! /admin/categories
              { path: "categories/create", element: <CategoryCreateScreen /> },
              {
                path: "categories/:categoryId/update",
                element: <CategoryUpdateScreen />,
              },
              //! /admin/subcategories
              {
                path: "subcategories/create",
                element: <SubCategoryCreateScreen />,
              },
              {
                path: "subcategories/:subCategoryId/update",
                element: <SubCategoryUpdateScreen />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
