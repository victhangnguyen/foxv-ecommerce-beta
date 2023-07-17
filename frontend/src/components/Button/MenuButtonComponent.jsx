import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MenuButtonComponent = ({ handleClickActionTypeSubmit, menuItems }) => {
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
      <FontAwesomeIcon icon="fa-solid fa-ellipsis-vertical" ssize="6x" />
    </button>
  ));

  const renderDropdownItems = menuItems?.map((item) => (
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
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MenuButtonComponent;
