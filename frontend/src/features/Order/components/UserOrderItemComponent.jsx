import React from "react";
import { Link } from "react-router-dom";
import { FormCheck } from "react-bootstrap";
import MenuButtonComponent from "../../../components/Button/MenuButtonComponent";
//! imp Constants
import constants from "../../../constants";

const OrderItemComponent = ({
  order,
  selectedIds,
  handleCheckChange,
  handleOpenModal,
}) => {
  const menuItems = [
    {
      key: "menu-item-0",
      label: "Tải đơn hàng",
      actionType: constants.order.actionTypes.DOWNLOAD_INVOICE,
    },
  ];

  return (
    <>
      <tr className="bg-item">
        {
          //! checkBox
        }
        <td className="py-1 px-3">
          <FormCheck
            inline
            id={order._id}
            checked={selectedIds.includes(order._id)}
            onChange={handleCheckChange}
          />
        </td>
        {
          //! _id
        }
        <td className="py-1 px-3 tab__id">
          <Link to={`/admin/orders/${order._id}/update`}>
            <strong>{order._id}</strong>
          </Link>
        </td>
        {
          //! name
        }
        <td className="py-1 px-3 mt-1 tab__name">
          <p>{order.name}</p>
        </td>
        {
          //! address
        }
        <td className="py-1 px-3 tab__address">{order.address}</td>
        {
          //! status
        }
        <td className="py-1 px-3 tab__status">{order.status}</td>
        {
          //! status
        }
        <td className="py-1 px-3 tab__menu">
          <MenuButtonComponent
            menuItems={menuItems}
            handleClickActionTypeSubmit={(actionType) =>
              handleOpenModal(actionType, order._id)
            }
          />
        </td>
      </tr>
      <tr id="spacing-row">
        <td></td>
      </tr>
    </>
  );
};

export default OrderItemComponent;
