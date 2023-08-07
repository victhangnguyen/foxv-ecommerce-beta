import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

//! imp Actions
import { getAnalysis } from "../dashboardSlice";

const AdminDashboardContentComponent = () => {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dashboard);

  React.useEffect(() => {
    function loadAnalysis() {
      dispatch(getAnalysis());
    }
    loadAnalysis();
  }, [
    dispatch,
    dashboard.productsCount,
    dashboard.ordersCount,
    dashboard.usersCount,
  ]);

  const renderNewOrdersNotification = dashboard?.orders.map((order) => {
    return (
      <div key={order?._id} className="notification mb-3">
        <Link to={`/admin/orders/${order?._id}/update`}>
          <div className="notification-icon">
            <i className="fas fa-inbox"></i>
            <span> {order?._id}</span>
          </div>
          <div className="notification-text">{order?.name}</div>
          <span className="notification-time">
            created At: {order?.updatedAt}
          </span>
        </Link>
      </div>
    );
  });

  return (
    <main className="dash-content">
      <div className="container-fluid">
        <div className="row dash-row">
          <div className="col-xl-4">
            <div className="stats stats-primary">
              <h3 className="stats-title">Số sản phẩm</h3>
              <div className="stats-content">
                <div className="stats-icon">
                  <i className="fa-solid fa-shirt"></i>
                </div>
                <div className="stats-data">
                  <div className="stats-number">{dashboard?.productsCount}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="stats stats-success ">
              <h3 className="stats-title">Số tài khoản</h3>
              <div className="stats-content">
                <div className="stats-icon">
                  <i className="fas fa-user"></i>
                </div>
                <div className="stats-data">
                  <div className="stats-number">{dashboard?.usersCount}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="stats stats-danger">
              <h3 className="stats-title">Số đơn hàng</h3>
              <div className="stats-content">
                <div className="stats-icon">
                  <i className="fas fa-cart-arrow-down"></i>
                </div>
                <div className="stats-data">
                  <div className="stats-number">{dashboard?.ordersCount}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-6">
            <div className="card spur-card">
              <div className="card-header">
                <div className="spur-card-icon">
                  <i className="fas fa-bell"></i>
                </div>
                <div className="spur-card-title">Đơn hàng mới nhất</div>
              </div>
              <div className="card-body ">
                <div className="notifications">
                  {renderNewOrdersNotification}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboardContentComponent;
