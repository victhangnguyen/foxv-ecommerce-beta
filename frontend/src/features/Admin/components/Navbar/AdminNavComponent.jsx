import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

const AdminNavComponent = () => {
  const adminNavItems = [
    {
      key: 'nav-item-1',
      label: 'Dashboard',
      path: '/admin/dashboard',
    },
    {
      key: 'nav-item-2',
      label: 'Thêm sản phẩm',
      path: '/admin/product',
    },
    {
      key: 'nav-item-3',
      label: 'Thêm Loại (Category)',
      path: '/admin/category',
    },
    {
      key: 'nav-item-4',
      label: 'Thêm Kiểu (Sub)',
      path: '/admin/subcategory',
    },
    {
      key: 'nav-item-5',
      label: 'Quản lý Sản phẩm',
      path: '/admin/products',
    },
    {
      key: 'nav-item-6',
      label: 'Quản lý Tài khoản (User)',
      path: '/admin/users',
    },
    {
      key: 'nav-item-7',
      label: 'Quản lý Mua hàng (Order)',
      path: '/admin/orders',
    },
    {
      key: 'nav-item-8',
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
