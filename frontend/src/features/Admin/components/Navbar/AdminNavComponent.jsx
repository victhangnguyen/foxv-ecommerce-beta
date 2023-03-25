import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

const AdminNavComponent = () => {
  const adminNavItems = [
    {
      key: 'admin-nav-item-0',
      label: 'Dashboard',
      path: '/admin/dashboard',
    },

    {
      key: 'admin-nav-item-1',
      label: 'Quản lý Loại (Cate)',
      path: '/admin/categories/create',
    },
    {
      key: 'admin-nav-item-2',
      label: 'Quản lý Kiểu (Sub)',
      path: '/admin/subcategories/create',
    },
    {
      key: 'admin-nav-item-3',
      label: 'Quản lý Sản phẩm (Product)',
      path: '/admin/products',
    },
    {
      key: 'admin-nav-item-4',
      label: 'Thêm sản phẩm',
      path: '/admin/products/create',
    },
    {
      key: 'admin-nav-item-5',
      label: 'Quản lý Tài khoản (User)',
      path: '/admin/users',
    },
    {
      key: 'admin-nav-item-6',
      label: 'Thêm Tài khoản',
      path: '/admin/users/create',
    },
    {
      key: 'admin-nav-item-7',
      label: 'Quản lý Mua hàng (Order)',
      path: '/admin/orders',
    },
    {
      key: 'admin-nav-item-8',
      label: 'Thay đổi mật khẩu',
      path: '/user/password',
    },
  ];
  const renderAdminNavItems = adminNavItems.map((item) => (
    <Nav.Item key={item.key}>
      <Link to={item.path} className="nav-link">
        {item.label}
      </Link>
    </Nav.Item>
  ));
  return <Nav className="flex-column">{renderAdminNavItems}</Nav>;
};

export default AdminNavComponent;
