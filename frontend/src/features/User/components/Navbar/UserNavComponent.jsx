import React from "react";
import { Nav } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const AdminNavComponent = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const userId = auth.user?._id;

  const adminNavItems = [
    // {
    //   key: 'user-nav-item-0',
    //   label: 'Dashboard',
    //   pathname: '/admin/dashboard',
    // },
    {
      key: "user-nav-item-1",
      label: "Thông tin - Bảo mật",
      path: `/users/${userId}/update`,
    },
    {
      key: "user-nav-item-2",
      label: "Lịch sử mua hàng",
      path: `/users/${userId}/history-orders`,
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
