import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

const MenuButton = ({ handleSubmit }) => {
  const dropdownItems = [
    {
      key: 'action-menu-0',
      label: 'Xóa tài khoản',
      typeAction: 'deleteUsers',
    },
    {
      key: 'action-menu-1',
      label: 'Reset Password',
      typeAction: 'resetPasswords',
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
      <FontAwesomeIcon icon={faEllipsisV} />
    </button>
  ));

  const renderDropdownItems = dropdownItems.map((item) => (
    <Dropdown.Item
      key={item.key}
      eventKey={item.key}
      onClick={() => handleSubmit(item.typeAction)}
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
