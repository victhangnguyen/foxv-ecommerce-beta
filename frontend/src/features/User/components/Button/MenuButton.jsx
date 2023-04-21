import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//! imp actionTypes
import { DELETE_USERS, RESET_PASSWORDS } from '../../services/actionTypes';

const MenuButton = ({ handleClickActionTypeSubmit }) => {
  const menuItems = [
    {
      key: 'menu-item-0',
      label: 'Xóa tài khoản',
      actionType: DELETE_USERS,
    },
    {
      key: 'menu-item-1',
      label: 'Reset Password',
      actionType: RESET_PASSWORDS,
    },
  ];

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <button
      className="btn btn-EllipsisV"
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      <FontAwesomeIcon icon="fa-solid fa-ellipsis-vertical" />
    </button>
  ));

  const renderDropdownItems = menuItems.map((item) => (
    <Dropdown.Item
      key={item.key}
      eventKey={item.key}
      onClick={() => handleClickActionTypeSubmit(item.actionType)}
    >
      {item.label}
    </Dropdown.Item>
  ));

  return (
    <Dropdown>
      <Dropdown.Toggle
        as={CustomToggle}
        id="dropdown-custom-components"
      ></Dropdown.Toggle>

      <Dropdown.Menu>
        {renderDropdownItems}
        {/* <Dropdown.Item eventKey="3" active> */}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MenuButton;
