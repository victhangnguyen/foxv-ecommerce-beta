import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AdminNavComponent = () => {
  const location = useLocation();

  const adminNavItems = [
    // {
    //   key: 'admin-nav-item-0',
    //   label: 'Dashboard',
    //   pathname: '/admin/dashboard',
    // },
    {
      key: 'admin-nav-item-1',
      icon: 'fa-solid fa-shirt',
      label: 'Quản lý Loại (Cat)',
      pathname: '/admin/categories/create',
    },
    {
      key: 'admin-nav-item-2',
      icon: 'fa-solid fa-shirt',
      label: 'Quản lý Kiểu (Sub)',
      pathname: '/admin/subcategories/create',
    },
    {
      key: 'admin-nav-item-3',
      icon: '<fa-solid fa-file',
      label: 'Quản lý Sản phẩm (Product)',
      pathname: '/admin/products',
    },
    {
      key: 'admin-nav-item-4',
      icon: 'fa-solid fa-file-circle-plus',
      label: 'Thêm sản phẩm',
      pathname: '/admin/products/create',
    },
    {
      key: 'admin-nav-item-5',
      icon: 'fa-solid fa-user',
      label: 'Quản lý Tài khoản (User)',
      pathname: '/admin/users',
    },
    {
      key: 'admin-nav-item-6',
      icon: '<fa-solid fa-user-plus',
      label: 'Thêm Tài khoản',
      pathname: '/admin/users/create',
    },
    {
      key: 'admin-nav-item-7',
      icon: 'fa-solid fa-cart-shopping',
      label: 'Quản lý Mua hàng (Order)',
      pathname: '/admin/orders',
    },
    {
      key: 'admin-nav-item-8',
      icon: 'fa-solid fa-cart-shopping',
      label: 'Tạo đơn hàng',
      pathname: '/cart',
    },
  ];
  const renderAdminNavItems = adminNavItems.map((item) => (
    <Link
      key={item.key}
      to={item.pathname}
      className={`nav-link ${
        location.pathname === item.pathname ? 'active' : ''
      }`}
    >
      <Nav.Item className="">
        <span className="me-2">
          {item.icon && <FontAwesomeIcon icon={item.icon} />}
        </span>
        <span>{item.label}</span>
      </Nav.Item>
    </Link>
  ));
  return <Nav className="flex-column admin-nav">{renderAdminNavItems}</Nav>;
};

export default AdminNavComponent;
