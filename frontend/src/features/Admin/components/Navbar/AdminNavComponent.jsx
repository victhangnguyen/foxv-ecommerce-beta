import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

const AdminNavComponent = () => {
  return (
    <Nav className="flex-column">
      <div className="nav-dashboard">
        <Nav.Item>
          <Link to={`/admin/dashboard`} className="nav-link">
            Dashboard
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to={`/admin/products`} className="nav-link">
            Quản lý Sản phẩm
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to={`/admin/product`} className="nav-link">
            Thêm sản phẩm
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to={`/admin/category`} className="nav-link">
            Thêm Category
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to={`/admin/subcategory`} className="nav-link">
            Thêm Sub-Category
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to={`/admin/coupon`} className="nav-link">
            Coupon
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to={`/user/password`} className="nav-link">
            Change Password
          </Link>
        </Nav.Item>
      </div>
    </Nav>
  );
};

export default AdminNavComponent;
