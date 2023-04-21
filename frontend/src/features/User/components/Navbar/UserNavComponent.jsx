import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const AdminNavComponent = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const userId = auth.user?._id;

  const adminNavItems = [
    {
      key: 'nav-item-1',
      label: 'Thông tin - Bảo mật',
      path: `/users/${userId}/update`,
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
