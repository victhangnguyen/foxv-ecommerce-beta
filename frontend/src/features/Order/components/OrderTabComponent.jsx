import React from "react";
import { Form, Button, FormCheck } from "react-bootstrap";
//! imp Comps
import OrderItemComponent from "./OrderItemComponent";
import ToolbarComponent from "../components/ToolbarComponent";

const OrderTabComponent = ({
  orders,
  selectedIds,
  isCheckAll,
  keyword,
  setKeyword,
  setSearch,
  handleOpenModal,
  handleCheckChange,
  handleCheckAllChange,
}) => {
  const renderOrderItems = orders?.map((order) => {
    return (
      <OrderItemComponent
        isAdmin={true}
        key={order._id}
        order={order}
        selectedIds={selectedIds}
        handleOpenModal={handleOpenModal}
        handleCheckChange={handleCheckChange}
      />
    );
  });

  return (
    <div className="container">
      <div className="d-flex">
        <ToolbarComponent
          selectedIds={selectedIds}
          isCheckAll={isCheckAll}
          keyword={keyword}
          setKeyword={setKeyword}
          setSearch={setSearch}
          handleCheckAllChange={handleCheckAllChange}
          handleOpenModal={handleOpenModal}
        />
      </div>

      <div className="table-responsive">
        <table className="table__orders">
          <thead>
            <tr>
              <th scope="col" className="col py-1 px-3"></th>
              <th scope="col" className="col-3 py-1 px-3 text-center">
                Id
              </th>
              <th scope="col" className="col-3 py-1 px-3 text-center">
                Name
              </th>
              <th scope="col" className="col-4 py-1 px-3 text-center">
                Address
              </th>
              <th scope="col" className="col-2 py-1 px-3 text-center">
                Status
              </th>
              <th scope="col" className="col"></th>
            </tr>
          </thead>
          <tbody>{renderOrderItems}</tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTabComponent;
